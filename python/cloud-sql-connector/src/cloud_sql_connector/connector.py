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

# Cloud SQL connection utilities (IAM-safe, Python 3.9+ stable)

import os
import threading
from dataclasses import dataclass

from google.cloud.sql.connector import Connector
from sqlalchemy import event

# -------------------------------------------------------------------
# Global state (process-safe, not thread-safe across forks)
# -------------------------------------------------------------------

_connector = None
_connector_pid = None
_lock = threading.Lock()
_connect_lock = threading.Lock()


# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------

@dataclass
class DBConfig:
    instance_name: str
    database: str
    user: str
    ip_type: str
    schema: str
    enable_iam_auth: bool = True
    driver: str = "pg8000"

    pool_size: int = 5
    max_overflow: int = 2
    pool_timeout: int = 10
    pool_recycle: int = 300
    pool_use_lifo: bool = True
    pool_pre_ping: bool = True
    connect_args: dict = None

    def __post_init__(self):
        if self.connect_args is None:
            self.connect_args = {}

    def get_engine_options(self):
        return {
            "creator": lambda: getconn(self),
            "pool_size": self.pool_size,
            "max_overflow": self.max_overflow,
            "pool_timeout": self.pool_timeout,
            "pool_recycle": self.pool_recycle,
            "pool_pre_ping": self.pool_pre_ping,
            "pool_use_lifo": self.pool_use_lifo,
            "connect_args": self.connect_args,
        }


# -------------------------------------------------------------------
# Connector (safe for Gunicorn + IAM)
# -------------------------------------------------------------------

def _get_connector() -> Connector:
    """
    Process-safe singleton connector.
    Prevents fork-related asyncio/event loop corruption in Python 3.9.
    """
    global _connector, _connector_pid

    pid = os.getpid()

    if _connector is None or _connector_pid != pid:
        with _lock:
            pid = os.getpid()
            if _connector is None or _connector_pid != pid:
                _connector = Connector(refresh_strategy="background")
                _connector_pid = pid

    return _connector


# -------------------------------------------------------------------
# Connection factory
# -------------------------------------------------------------------

def getconn(db_config: DBConfig):
    """
    Create a new DB connection using Cloud SQL IAM auth.
    Safe under Gunicorn concurrency.
    """

    connector = _get_connector()

    # Prevent IAM/token refresh stampede under load
    with _connect_lock:
        conn = connector.connect(
            instance_connection_string=db_config.instance_name,
            db=db_config.database,
            user=db_config.user,
            ip_type=db_config.ip_type,
            driver=db_config.driver,
            enable_iam_auth=db_config.enable_iam_auth,
        )

    return conn


# -------------------------------------------------------------------
# SQLAlchemy event: set schema per connection
# -------------------------------------------------------------------

def setup_search_path_event_listener(engine, schema: str):
    """
    Ensures schema is set consistently per checkout.
    Avoids doing SET search_path inside getconn (cleaner + safer).
    """

    @event.listens_for(engine, "checkout")
    def set_search_path(dbapi_connection, connection_record, connection_proxy):
        cursor = dbapi_connection.cursor()
        cursor.execute(f"SET search_path TO {schema}, public")
        cursor.close()
