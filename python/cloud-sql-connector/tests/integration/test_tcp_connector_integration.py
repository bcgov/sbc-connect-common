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
"""Integration tests for a locally accessible TCP endpoint."""

import os
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest

from cloud_sql_connector import TCPDBConfig, getconn, setup_search_path_event_listener


@pytest.mark.integration
@pytest.mark.skipif(
    not os.getenv("CLOUD_SQL_TCP_PORT"),
    reason="Local TCP endpoint not configured for integration tests",
)
class TestLocalTCPIntegration:
    """Integration tests for a locally accessible TCP endpoint."""

    @pytest.fixture
    def db_config(self):
        iam_auth = os.getenv("CLOUD_SQL_TCP_IAM_AUTH", "false").lower()
        if iam_auth not in ("true", "false"):
            raise ValueError("CLOUD_SQL_TCP_IAM_AUTH must be true or false")
        connect_args = {}
        if password := os.getenv("CLOUD_SQL_TCP_PASSWORD"):
            connect_args["password"] = password

        return TCPDBConfig(
            host=os.getenv("CLOUD_SQL_TCP_HOST", "127.0.0.1"),
            port=int(os.environ["CLOUD_SQL_TCP_PORT"]),
            database=os.getenv("CLOUD_SQL_TCP_DATABASE", "test_db"),
            user=os.getenv("CLOUD_SQL_TCP_USER", "test_user"),
            schema=os.getenv("CLOUD_SQL_TCP_SCHEMA", ""),
            connect_args=connect_args,
            enable_iam_auth=iam_auth == "true",
            credentials_file=os.getenv("CLOUD_SQL_TCP_CREDENTIALS_FILE"),
        )

    def test_real_connection(self, db_config):
        connection = getconn(db_config)
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT 1 as test_column")
            assert cursor.fetchone()[0] == 1
            cursor.close()
        finally:
            connection.close()

    def test_iam_token_refresh(self, db_config):
        if not db_config.enable_iam_auth:
            pytest.skip("Application-managed IAM authentication is not enabled")

        connection = getconn(db_config)
        connection.close()

        credentials = db_config._iam_credentials
        assert credentials is not None
        credentials.expiry = datetime.now(timezone.utc).replace(
            tzinfo=None
        ) - timedelta(seconds=1)

        with patch.object(credentials, "refresh", wraps=credentials.refresh) as refresh:
            connection = getconn(db_config)
            try:
                cursor = connection.cursor()
                cursor.execute("SELECT 1")
                assert cursor.fetchone()[0] == 1
                cursor.close()
            finally:
                connection.close()
            refresh.assert_called_once()

    def test_schema_configuration(self, db_config):
        if not db_config.schema:
            pytest.skip("Schema not configured for TCP integration test")

        connection = getconn(db_config)
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT current_schema()")
            assert db_config.schema == cursor.fetchone()[0]
            cursor.close()
        finally:
            connection.close()

    def test_connection_pooling(self, db_config):
        from sqlalchemy import create_engine, text

        engine = create_engine("postgresql+pg8000://", **db_config.get_engine_options())
        try:
            with engine.connect() as conn1, engine.connect() as conn2:
                assert conn1.execute(text("SELECT 1")).scalar() == 1
                assert conn2.execute(text("SELECT 2")).scalar() == 2
        finally:
            engine.dispose()

    def test_schema_persists_across_pool_checkouts(self, db_config):
        if not db_config.schema:
            pytest.skip("Schema not configured for TCP integration test")

        from sqlalchemy import create_engine, text

        engine = create_engine("postgresql+pg8000://", **db_config.get_engine_options())
        try:
            for _ in range(2):
                with engine.connect() as conn:
                    assert conn.execute(text("SELECT current_schema()")).scalar() == (
                        db_config.schema
                    )
        finally:
            engine.dispose()

    def test_checkout_listener_restores_schema(self, db_config):
        if not db_config.schema:
            pytest.skip("Schema not configured for TCP integration test")

        from sqlalchemy import create_engine, text

        engine = create_engine("postgresql+pg8000://", **db_config.get_engine_options())
        setup_search_path_event_listener(engine, db_config.schema)
        try:
            with engine.connect() as conn:
                conn.execute(text("SET search_path TO public"))
                conn.commit()

            with engine.connect() as conn:
                assert conn.execute(text("SELECT current_schema()")).scalar() == (
                    db_config.schema
                )
        finally:
            engine.dispose()
