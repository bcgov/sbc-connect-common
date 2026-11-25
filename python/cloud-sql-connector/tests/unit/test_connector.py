# Copyright © 2025 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Unit tests for the cloud SQL connector module."""

import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, Mock, patch

import pytest
from google.auth.credentials import Credentials

from cloud_sql_connector.connector import (
    DBConfig,
    TCPDBConfig,
    close_connector,
    getconn,
    setup_pg8000_close_event_listener,
    setup_search_path_event_listener,
)


class FakeIAMCredentials(Credentials):
    def __init__(self):
        super().__init__()
        self.refresh_count = 0

    def refresh(self, request):
        time.sleep(0.01)
        self.refresh_count += 1
        self.token = f"token-{self.refresh_count}"
        self.expiry = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(
            hours=1
        )


class TestDBConfig:
    """Test the DBConfig dataclass."""

    def test_db_config_creation(self):
        """Test creating a DBConfig instance."""
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema="test_schema",
        )

        assert config.instance_name == "project:region:instance"
        assert config.database == "test_db"
        assert config.user == "test_user"
        assert config.ip_type == "public"
        assert config.schema == "test_schema"

    def test_db_config_empty_schema(self):
        """Test creating a DBConfig instance with empty schema."""
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema="",
        )

        assert config.schema == ""

    @pytest.mark.parametrize(
        "config",
        [
            DBConfig(
                instance_name="project:region:instance",
                database="test_db",
                user="test_user",
                ip_type="public",
                schema="",
                connect_args={"password": "test_password"},
            ),
            TCPDBConfig(
                database="test_db",
                user="test_user",
                connect_args={"password": "test_password"},
            ),
        ],
    )
    def test_config_repr_does_not_expose_connect_args(self, config):
        assert "test_password" not in repr(config)


class TestGetconn:
    """Test the getconn function."""

    @patch("cloud_sql_connector.connector._connector")
    def test_getconn_without_schema(self, mock_connector):
        """Test getconn function without schema."""
        # Setup mocks
        mock_connection = Mock()
        mock_connector.connect.return_value = mock_connection

        # Create config without schema
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema="",
        )

        # Call function
        result = getconn(config)

        # Assertions
        mock_connector.connect.assert_called_once_with(
            instance_connection_string="project:region:instance",
            db="test_db",
            user="test_user",
            ip_type="public",
            driver="pg8000",
            enable_iam_auth=True,
        )
        assert result == mock_connection

    @patch("cloud_sql_connector.connector.pg8000.connect")
    def test_getconn_tcp(self, mock_connect):
        connection = Mock()
        mock_connect.return_value = connection
        config = TCPDBConfig(
            database="test_db",
            user="test_user",
            host="localhost",
            port=5433,
            connect_args={"password": "test_password"},
        )

        result = getconn(config)

        mock_connect.assert_called_once_with(
            password="test_password",
            host="localhost",
            port=5433,
            database="test_db",
            user="test_user",
        )
        assert result is connection

    @patch("cloud_sql_connector.connector.pg8000.connect")
    def test_getconn_tcp_sets_schema(self, mock_connect):
        connection = Mock()
        mock_cursor = Mock()
        connection.cursor.return_value = mock_cursor
        mock_connect.return_value = connection
        config = TCPDBConfig(
            database="test_db",
            user="test_user",
            schema='Mixed"Name',
        )

        result = getconn(config)

        mock_connect.assert_called_once_with(
            host="127.0.0.1", port=5432, database="test_db", user="test_user"
        )
        mock_cursor.execute.assert_called_once_with(
            'SET search_path TO "Mixed""Name", public'
        )
        mock_cursor.close.assert_called_once()
        connection.commit.assert_called_once_with()
        assert result is connection

    @patch("cloud_sql_connector.connector.pg8000.connect")
    def test_getconn_closes_cursor_if_schema_setup_fails(self, mock_connect):
        connection = mock_connect.return_value
        cursor = connection.cursor.return_value
        cursor.execute.side_effect = RuntimeError("schema setup failed")
        config = TCPDBConfig(database="test_db", user="test_user", schema="test_schema")

        with pytest.raises(RuntimeError, match="schema setup failed"):
            getconn(config)

        cursor.close.assert_called_once_with()
        connection.commit.assert_not_called()

    def test_tcp_engine_options_use_tcp_connection_factory(self):
        config = TCPDBConfig(database="test_db", user="test_user")

        options = config.get_engine_options()

        assert options["pool_size"] == config.pool_size
        assert options["connect_args"] == config.connect_args

    @patch("cloud_sql_connector.connector.pg8000.connect")
    @patch("cloud_sql_connector.connector.google.auth.default")
    def test_tcp_iam_reuses_and_refreshes_token(self, mock_default, mock_connect):
        credentials = FakeIAMCredentials()
        mock_default.return_value = (credentials, None)
        config = TCPDBConfig(database="test_db", user="test_user", enable_iam_auth=True)

        getconn(config)
        config.get_engine_options()["creator"]()
        credentials.expiry = datetime.now(timezone.utc).replace(
            tzinfo=None
        ) - timedelta(seconds=1)
        getconn(config)

        mock_default.assert_called_once_with(
            scopes=["https://www.googleapis.com/auth/sqlservice.login"]
        )
        assert [c.kwargs["password"] for c in mock_connect.call_args_list] == [
            "token-1",
            "token-1",
            "token-2",
        ]
        assert "password" not in config.connect_args

    @patch("cloud_sql_connector.connector.pg8000.connect")
    @patch("cloud_sql_connector.connector.google.auth.load_credentials_from_file")
    def test_tcp_iam_explicit_credentials_file(self, mock_load, mock_connect):
        mock_load.return_value = (FakeIAMCredentials(), None)
        config = TCPDBConfig(
            database="test_db",
            user="test_user",
            enable_iam_auth=True,
            credentials_file="/path/to/wif-config.json",
        )

        getconn(config)

        mock_load.assert_called_once_with(
            "/path/to/wif-config.json",
            scopes=["https://www.googleapis.com/auth/sqlservice.login"],
        )
        assert mock_connect.call_args.kwargs["password"] == "token-1"

    @patch("cloud_sql_connector.connector.pg8000.connect")
    @patch("cloud_sql_connector.connector.google.auth.default")
    def test_tcp_iam_refresh_is_synchronized(self, mock_default, mock_connect):
        credentials = FakeIAMCredentials()
        mock_default.return_value = (credentials, None)
        config = TCPDBConfig(database="test_db", user="test_user", enable_iam_auth=True)
        barrier = threading.Barrier(8)

        def connect(_):
            barrier.wait(timeout=5)
            return getconn(config)

        with ThreadPoolExecutor(max_workers=8) as executor:
            list(executor.map(connect, range(8)))

            assert credentials.refresh_count == 1
            assert all(
                c.kwargs["password"] == "token-1" for c in mock_connect.call_args_list
            )
            mock_connect.reset_mock()
            credentials.expiry = datetime.now(timezone.utc).replace(
                tzinfo=None
            ) - timedelta(seconds=1)

            list(executor.map(connect, range(8)))

        mock_default.assert_called_once()
        assert credentials.refresh_count == 2
        assert mock_connect.call_count == 8
        assert all(
            c.kwargs["password"] == "token-2" for c in mock_connect.call_args_list
        )

    @patch("cloud_sql_connector.connector.pg8000.connect")
    @patch("cloud_sql_connector.connector.google.auth.default")
    def test_tcp_iam_refresh_failure_is_propagated(self, mock_default, mock_connect):
        credentials = FakeIAMCredentials()
        credentials.refresh = Mock(side_effect=RuntimeError("refresh failed"))
        mock_default.return_value = (credentials, None)
        config = TCPDBConfig(database="test_db", user="test_user", enable_iam_auth=True)

        with pytest.raises(RuntimeError, match="refresh failed"):
            getconn(config)
        mock_connect.assert_not_called()

    @patch("cloud_sql_connector.connector.pg8000.connect")
    @patch("cloud_sql_connector.connector.google.auth.default")
    def test_tcp_iam_missing_token_fails(self, mock_default, mock_connect):
        credentials = FakeIAMCredentials()
        credentials.refresh = Mock()
        mock_default.return_value = (credentials, None)
        config = TCPDBConfig(database="test_db", user="test_user", enable_iam_auth=True)

        with pytest.raises(RuntimeError, match="did not provide an access token"):
            getconn(config)
        mock_connect.assert_not_called()

    @patch("cloud_sql_connector.connector.pg8000.connect")
    @patch("cloud_sql_connector.connector.google.auth.default")
    def test_tcp_iam_rejects_explicit_password(self, mock_default, mock_connect):
        config = TCPDBConfig(
            database="test_db",
            user="test_user",
            enable_iam_auth=True,
            connect_args={"password": "test_password"},
        )

        with pytest.raises(ValueError, match="must not contain password"):
            getconn(config)
        mock_default.assert_not_called()
        mock_connect.assert_not_called()

    @patch("cloud_sql_connector.connector._connector")
    def test_getconn_with_schema(self, mock_connector):
        """Test getconn function with schema."""
        # Setup mocks
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connector.connect.return_value = mock_connection

        # Create config with schema
        config = DBConfig(
            instance_name="project:region:instance",
            database="test_db",
            user="test_user",
            ip_type="public",
            schema="test_schema",
        )

        # Call function
        result = getconn(config)

        # Assertions
        mock_connector.connect.assert_called_once_with(
            instance_connection_string="project:region:instance",
            db="test_db",
            user="test_user",
            ip_type="public",
            driver="pg8000",
            enable_iam_auth=True,
        )

        # Check cursor calls for schema setup
        mock_connection.cursor.assert_called()
        mock_cursor.execute.assert_called_once_with(
            'SET search_path TO "test_schema", public'
        )
        mock_cursor.close.assert_called_once()
        mock_connection.commit.assert_called_once_with()

        assert result == mock_connection


class TestCloseConnector:
    """Test the close_connector function."""

    @patch("cloud_sql_connector.connector._connector")
    def test_close_connector_closes_singleton(self, mock_connector):
        """Test close_connector closes and clears the singleton connector."""
        close_connector()

        mock_connector.close.assert_called_once_with()

        from cloud_sql_connector import connector

        assert connector._connector is None

    @patch("cloud_sql_connector.connector._connector", None)
    def test_close_connector_without_singleton(self):
        """Test close_connector is a no-op when the singleton is unset."""
        close_connector()


class TestSetupSearchPathEventListener:
    """Test the setup_search_path_event_listener function."""

    @patch("cloud_sql_connector.connector.event")
    def test_setup_search_path_event_listener(self, mock_event):
        """Test setting up the search path event listener."""
        mock_engine = Mock()
        schema = "test_schema"

        # Call function
        setup_search_path_event_listener(mock_engine, schema)

        # Verify event listener is set up
        mock_event.listens_for.assert_called_once_with(mock_engine, "checkout")

    @patch("cloud_sql_connector.connector.event")
    def test_event_listener_callback(self, mock_event):
        """Test the event listener callback function."""
        mock_engine = Mock()
        schema = 'Mixed"Name'

        # Capture the callback function
        callback_function = None

        def capture_callback(engine, event_name):
            def decorator(func):
                nonlocal callback_function
                callback_function = func
                return func

            return decorator

        mock_event.listens_for.side_effect = capture_callback

        # Setup the event listener
        setup_search_path_event_listener(mock_engine, schema)

        # Test the callback
        mock_dbapi_connection = Mock()
        mock_cursor = Mock()
        mock_dbapi_connection.cursor.return_value = mock_cursor

        mock_connection_record = Mock()
        mock_connection_proxy = Mock()

        # Call the callback
        callback_function(
            mock_dbapi_connection, mock_connection_record, mock_connection_proxy
        )

        # Verify cursor operations
        mock_dbapi_connection.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once_with(
            'SET search_path TO "Mixed""Name", public'
        )
        mock_cursor.close.assert_called_once()
        mock_dbapi_connection.commit.assert_not_called()

    @patch("cloud_sql_connector.connector.event")
    def test_empty_schema_does_not_register_listener(self, mock_event):
        setup_search_path_event_listener(Mock(), "")
        mock_event.listens_for.assert_not_called()


class TestSetupPg8000CloseEventListener:
    """Test the setup_pg8000_close_event_listener function."""

    @patch("cloud_sql_connector.connector.event")
    def test_setup_pg8000_close_event_listener_non_pg8000(self, mock_event):
        """Test setting up the event listener skips when driver is not pg8000."""
        mock_engine = Mock()
        mock_engine.driver = "psycopg2"

        # Call function
        setup_pg8000_close_event_listener(mock_engine)

        # Verify event listener is NOT set up
        mock_event.listens_for.assert_not_called()

    @patch("cloud_sql_connector.connector.event")
    def test_setup_pg8000_close_event_listener(self, mock_event):
        """Test setting up the pg8000 close event listener."""
        mock_engine = Mock()
        mock_engine.driver = "pg8000"

        # Call function
        setup_pg8000_close_event_listener(mock_engine)

        # Verify event listener is set up
        mock_event.listens_for.assert_called_once_with(mock_engine, "connect")

    @patch("cloud_sql_connector.connector.event")
    def test_event_listener_callback_normal_close(self, mock_event):
        """Test the event listener callback function with normal close."""
        mock_engine = Mock()
        mock_engine.driver = "pg8000"

        # Capture the callback function
        callback_function = None

        def capture_callback(engine, event_name):
            def decorator(func):
                nonlocal callback_function
                callback_function = func
                return func

            return decorator

        mock_event.listens_for.side_effect = capture_callback

        # Setup the event listener
        setup_pg8000_close_event_listener(mock_engine)

        # Test the callback
        mock_dbapi_conn = Mock()
        original_close = mock_dbapi_conn.close
        mock_connection_record = Mock()

        # Call the callback to setup the wrapper
        callback_function(mock_dbapi_conn, mock_connection_record)

        # Now mock_dbapi_conn.close should be the wrapped safe_close
        mock_dbapi_conn.close()

        # original_close should have been called
        original_close.assert_called_once()

    @patch("cloud_sql_connector.connector.event")
    def test_event_listener_callback_interface_error(self, mock_event):
        """Test the event listener callback function suppressing InterfaceError."""
        mock_engine = Mock()
        mock_engine.driver = "pg8000"

        # Capture the callback function
        callback_function = None

        def capture_callback(engine, event_name):
            def decorator(func):
                nonlocal callback_function
                callback_function = func
                return func

            return decorator

        mock_event.listens_for.side_effect = capture_callback

        # Setup the event listener
        setup_pg8000_close_event_listener(mock_engine)

        # Mock the dbapi_conn and its close method to raise InterfaceError
        try:
            from pg8000.exceptions import InterfaceError
        except ImportError:
            InterfaceError = Exception

        mock_dbapi_conn = Mock()
        original_close = Mock(side_effect=InterfaceError("Test InterfaceError"))
        mock_dbapi_conn.close = original_close
        mock_connection_record = Mock()

        # Call the callback to setup the wrapper
        callback_function(mock_dbapi_conn, mock_connection_record)

        # Now mock_dbapi_conn.close should be the wrapped safe_close
        # This shouldn't raise any exception
        mock_dbapi_conn.close()

        # original_close should have been called
        original_close.assert_called_once()

    @patch("cloud_sql_connector.connector.event")
    def test_event_listener_callback_value_error(self, mock_event):
        """Test the event listener callback suppresses ValueError (e.g. "write to closed
        file", observed in production when the underlying socket is already closed)."""
        mock_engine = Mock()
        mock_engine.driver = "pg8000"
        callback_function = None

        def capture_callback(engine, event_name):
            def decorator(func):
                nonlocal callback_function
                callback_function = func
                return func

            return decorator

        mock_event.listens_for.side_effect = capture_callback

        # Setup the event listener
        setup_pg8000_close_event_listener(mock_engine)

        # Mock the dbapi_conn and its close method to raise ValueError
        mock_dbapi_conn = Mock()
        original_close = Mock(side_effect=ValueError("write to closed file"))
        mock_dbapi_conn.close = original_close
        mock_connection_record = Mock()

        # Call the callback to setup the wrapper
        callback_function(mock_dbapi_conn, mock_connection_record)

        # Now mock_dbapi_conn.close should be the wrapped safe_close
        # This shouldn't raise any exception
        mock_dbapi_conn.close()

        # original_close should have been called
        original_close.assert_called_once()

    @patch("cloud_sql_connector.connector.event")
    def test_event_listener_callback_os_error(self, mock_event):
        """Test the event listener callback suppresses OSError (e.g. a broken pipe when the
        Cloud SQL Auth Proxy sidecar is torn down before the app during Cloud Run scale-down)."""
        mock_engine = Mock()
        mock_engine.driver = "pg8000"
        callback_function = None

        def capture_callback(engine, event_name):
            def decorator(func):
                nonlocal callback_function
                callback_function = func
                return func

            return decorator

        mock_event.listens_for.side_effect = capture_callback

        # Setup the event listener
        setup_pg8000_close_event_listener(mock_engine)

        # Mock the dbapi_conn and its close method to raise OSError
        mock_dbapi_conn = Mock()
        original_close = Mock(side_effect=OSError("Broken pipe"))
        mock_dbapi_conn.close = original_close
        mock_connection_record = Mock()

        # Call the callback to setup the wrapper
        callback_function(mock_dbapi_conn, mock_connection_record)

        # Now mock_dbapi_conn.close should be the wrapped safe_close
        # This shouldn't raise any exception
        mock_dbapi_conn.close()

        # original_close should have been called
        original_close.assert_called_once()
