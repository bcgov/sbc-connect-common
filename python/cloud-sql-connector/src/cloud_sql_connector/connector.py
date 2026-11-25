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
"""Cloud SQL connection utilities for the Notify API service."""

import threading
import time
from _thread import LockType
from dataclasses import dataclass, field

import google.auth
import pg8000
from google.auth.credentials import Credentials
from google.auth.transport.requests import Request
from google.cloud.sql.connector import Connector
from sqlalchemy import event

_connector = None
_lock = threading.Lock()
_IAM_LOGIN_SCOPES = ["https://www.googleapis.com/auth/sqlservice.login"]


@dataclass
class DBConfig:
    """Database configuration settings."""

    instance_name: str
    database: str
    user: str
    ip_type: str
    schema: str
    enable_iam_auth: bool = True
    driver: str = "pg8000"

    # Connection pool parameters
    pool_size: int = 5
    max_overflow: int = 2
    pool_timeout: int = 10
    pool_recycle: int = 300
    pool_use_lifo: bool = True
    pool_pre_ping: bool = True
    connect_args: dict = field(default=None, repr=False)

    def __post_init__(self):
        """Initialize default connect_args if not provided."""
        if self.connect_args is None:
            self.connect_args = {}

    def get_engine_options(self) -> dict:
        """Get SQLAlchemy engine options for this configuration.

        Returns:
            dict: Dictionary of engine options suitable for SQLAlchemy create_engine()
        """
        return _get_engine_options(self)


@dataclass
class TCPDBConfig:
    """Database configuration for a locally accessible TCP endpoint."""

    database: str
    user: str
    host: str = "127.0.0.1"
    port: int = 5432
    schema: str = ""
    pool_size: int = 5
    max_overflow: int = 2
    pool_timeout: int = 10
    pool_recycle: int = 300
    pool_use_lifo: bool = True
    pool_pre_ping: bool = True
    connect_args: dict = field(default=None, repr=False)
    enable_iam_auth: bool = False
    credentials_file: str | None = None
    _iam_credentials: Credentials | None = field(
        default=None, init=False, repr=False, compare=False
    )
    _iam_lock: LockType = field(
        default_factory=threading.Lock, init=False, repr=False, compare=False
    )

    def __post_init__(self):
        """Initialize default connect_args if not provided."""
        if self.connect_args is None:
            self.connect_args = {}
        if self.credentials_file and not self.enable_iam_auth:
            raise ValueError("credentials_file requires enable_iam_auth=True")

    def get_engine_options(self) -> dict:
        """Get SQLAlchemy engine options for this TCP configuration."""
        return _get_engine_options(self)

    def _get_iam_token(self) -> str:
        with self._iam_lock:
            if self._iam_credentials is None:
                if self.credentials_file:
                    credentials, _ = google.auth.load_credentials_from_file(
                        self.credentials_file, scopes=_IAM_LOGIN_SCOPES
                    )
                else:
                    credentials, _ = google.auth.default(scopes=_IAM_LOGIN_SCOPES)
                self._iam_credentials = credentials

            if not self._iam_credentials.valid:
                self._iam_credentials.refresh(Request())
            token = self._iam_credentials.token
            if not token:
                raise RuntimeError("Google credentials did not provide an access token")
            return token


def _get_engine_options(config: DBConfig | TCPDBConfig) -> dict:
    return {
        "creator": lambda: getconn(config),
        "pool_size": config.pool_size,
        "max_overflow": config.max_overflow,
        "pool_timeout": config.pool_timeout,
        "pool_recycle": config.pool_recycle,
        "pool_pre_ping": config.pool_pre_ping,
        "pool_use_lifo": config.pool_use_lifo,
        "connect_args": config.connect_args,
    }


def _get_connector() -> Connector:
    """Get the singleton connector instance with lazy initialization.

    Returns:
        Connector: The singleton connector instance
    """
    global _connector

    if _connector is None:
        with _lock:
            if _connector is None:
                _connector = Connector(refresh_strategy="lazy")

    return _connector


def close_connector() -> None:
    """Close and clear the singleton connector instance."""
    global _connector

    with _lock:
        if _connector is not None:
            _connector.close()
            _connector = None


def getconn(db_config: DBConfig | TCPDBConfig) -> object:
    """Create a database connection.

    Args:
        db_config: The database configuration.

    Returns:
        object: A connection object to the database.
    """
    if isinstance(db_config, TCPDBConfig):
        connect_args = dict(db_config.connect_args)
        if db_config.enable_iam_auth:
            if "password" in connect_args:
                raise ValueError(
                    "connect_args must not contain password when IAM authentication is enabled"
                )
            connect_args["password"] = db_config._get_iam_token()
        connect_args.update(
            {
                "host": db_config.host,
                "port": db_config.port,
                "database": db_config.database,
                "user": db_config.user,
            }
        )
        conn = pg8000.connect(**connect_args)
        _set_search_path(conn, db_config.schema)
        return conn

    for attempt in range(3):
        try:
            connector = _get_connector()
            conn = connector.connect(
                instance_connection_string=db_config.instance_name,
                db=db_config.database,
                user=db_config.user,
                ip_type=db_config.ip_type,
                driver=db_config.driver,
                enable_iam_auth=db_config.enable_iam_auth,
            )

            _set_search_path(conn, db_config.schema)
            return conn

        except PermissionError as e:
            if attempt < 2:
                time.sleep(1)
                continue
            raise


def _set_search_path(conn, schema: str) -> None:
    if schema:
        _apply_search_path(conn, schema)
        conn.commit()


def _apply_search_path(conn, schema: str) -> None:
    quoted_schema = '"' + schema.replace('"', '""') + '"'
    cursor = conn.cursor()
    try:
        cursor.execute(f"SET search_path TO {quoted_schema}, public")
    finally:
        cursor.close()


def setup_search_path_event_listener(engine, schema):
    """Set up an event listener to set the search path for a database connection.

    Args:
        engine: The SQLAlchemy engine object
        schema: The database schema name to use
    """
    if not schema:
        return

    @event.listens_for(engine, "checkout")
    def set_search_path_on_checkout(
        dbapi_connection, connection_record, connection_proxy
    ):
        _apply_search_path(dbapi_connection, schema)


def setup_pg8000_close_event_listener(engine):
    """Set up an event listener to wrap dbapi connection close() to suppress pg8000 errors during Cloud Run scale-down.

    Closing a connection whose underlying socket is already dead (e.g. the Cloud SQL Auth
    Proxy sidecar was torn down first during Cloud Run scale-down, or the connection was
    otherwise dropped) can raise different exception types depending on exactly how and when
    the socket died - pg8000 has been observed to raise ``InterfaceError``, ``OSError``, and
    ``ValueError`` ("write to closed file") for what is functionally the same situation. Since
    the connection is being discarded either way, any exception raised while closing it is safe
    to log and swallow here.

    Args:
        engine: The SQLAlchemy engine object
    """
    if getattr(engine, "driver", None) != "pg8000":
        return

    import logging

    @event.listens_for(engine, "connect")
    def on_connect(dbapi_conn, _connection_record):
        original_close = dbapi_conn.close

        def safe_close():
            try:
                original_close()
            except Exception as e:
                logging.getLogger(__name__).debug(
                    "Suppressed %s while closing pg8000 connection during teardown: %s",
                    type(e).__name__,
                    e,
                )

        dbapi_conn.close = safe_close
