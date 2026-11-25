# Cloud SQL Connector

A Python library for connecting to Google Cloud SQL instances with authentication and schema management.

## Features

- Simplified Cloud SQL connection management
- IAM authentication support
- Automatic schema path configuration

## Installation

```bash
poetry install
```

## Usage

### Basic Connection

```python
from cloud_sql_connector import DBConfig, getconn

config = DBConfig(
    instance_name="project:region:instance",
    database="my_database",
    user="my_user",
    ip_type="public",
    schema="my_schema"
)

connection = getconn(config)
```

### SQLAlchemy Integration

```python
from sqlalchemy import create_engine

engine = create_engine("postgresql+pg8000://", creator=lambda: getconn(config))
```

### Local TCP Endpoint

Use `TCPDBConfig` to connect through a local TCP endpoint, such as a proxy listening
on `localhost`. The endpoint must already be running.

```python
from cloud_sql_connector import TCPDBConfig
from sqlalchemy import create_engine

config = TCPDBConfig(
    host="127.0.0.1",
    port=5432,
    database="my_database",
    user="my_user",
    schema="my_schema",
)

engine = create_engine("postgresql+pg8000://", **config.get_engine_options())
```

For proxy-managed IAM authentication, start the Cloud SQL Auth Proxy with `--auto-iam-authn`, leave `enable_iam_auth=False` (the default), and omit the password from `connect_args`. The proxy manages tokens using its own Google identity, which must match the database user. Configure the proxy's credentials and permissions separately.

With `enable_iam_auth=False`, a database password can instead be supplied through `connect_args` when the endpoint requires one.

For application-managed IAM authentication through a TCP tunnel, set
`enable_iam_auth=True` on `TCPDBConfig`. The library obtains a token from
Application Default Credentials (ADC) and refreshes it when needed before
opening a connection. Do not supply a password in `connect_args` in this mode. The database user must match the application's Google identity and have Cloud SQL IAM login permission and database privileges. For PostgreSQL service accounts, omit `.gserviceaccount.com` from the database user name.

Set `credentials_file` to a trusted Google credentials or workload identity federation configuration file to use a specific identity instead of default ADC.
For file-based federation, the external subject token must also be kept valid: refreshing a Google access token cannot renew a subject token written only once by an init container. This library does not manage that external token or the tunnel. Ensure the proxy is configured to pass through application credentials rather than automatically using the VM's IAM identity.

## Configuration

The `DBConfig` dataclass accepts the following parameters:

- `instance_name`: Cloud SQL instance connection string (format: `project:region:instance`)
- `database`: Database name
- `user`: Database user
- `ip_type`: IP type for connection (`public` or `private`)
- `schema`: Database schema (optional)
- `driver`: Database driver (optional - defaults to pg8000)

The `TCPDBConfig` dataclass accepts `host` (default `127.0.0.1`), `port` (default
`5432`), `database`, `user`, and optional `schema` and `connect_args` values.
`enable_iam_auth` defaults to `False`; `credentials_file` is optional and
requires IAM authentication to be enabled.

For either configuration, `schema` is a single PostgreSQL schema name and is
case-sensitive. Use the actual name without adding SQL identifier quotes.

### Connection Pool Parameters
- `pool_size`: Maximum number of connections to keep in the pool (default: 5).
- `max_overflow`: Number of extra connections allowed above `pool_size` (default: 2).
- `pool_timeout`: Seconds to wait before giving up on getting a connection from the pool (default: 10).
- `pool_recycle`: Seconds after which a connection is recycled (closed and reopened) to prevent stale connections (default: 300).
- `pool_pre_ping`: If `True`, test connections for liveness before using (default: True).
- `connect_args`: Dictionary of driver-specific connection arguments (default: None).

## Development

### Running Tests

#### Unit Tests

Run only unit tests:
```bash
poetry run pytest tests/unit/ -v
```

#### Integration Tests

**Prerequisites for Integration Tests:**

1. **Google Cloud Credentials**: Set up authentication using one of these methods:
   ```bash
   # Option 1: Service Account Key (for CI/CD)
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   
   # Option 2: Application Default Credentials (for local development)
   gcloud auth application-default login
   ```

2. **Cloud SQL Instance**: Ensure you have a running Cloud SQL PostgreSQL instance with:
   - IAM authentication enabled
   - The service account has Cloud SQL Client role
   - Database and user configured

**Running Integration Tests:**

Create .env file using .env.sample template.

```bash
set -a; source .env; set +a && poetry run pytest tests/integration/ -v
```

The local TCP integration tests are skipped unless `CLOUD_SQL_TCP_PORT` is set.
Configure `CLOUD_SQL_TCP_HOST` (default `127.0.0.1`), `CLOUD_SQL_TCP_DATABASE`, `CLOUD_SQL_TCP_USER`, and optionally `CLOUD_SQL_TCP_SCHEMA` and `CLOUD_SQL_TCP_PASSWORD`. Start the local endpoint before running the tests. For proxy-based IAM authentication, the proxy must be configured for automatic IAM database authentication and have access to Google credentials through ADC or `GOOGLE_APPLICATION_CREDENTIALS`.

To test application-managed IAM, set `CLOUD_SQL_TCP_IAM_AUTH=true` and unset
`CLOUD_SQL_TCP_PASSWORD`. Optionally set `CLOUD_SQL_TCP_CREDENTIALS_FILE` to a
specific credentials configuration; otherwise ADC is used. The database user
must match the Google identity used by the application. ADC may use a different
identity from `gcloud auth print-access-token`.

The `test_iam_token_refresh` integration test forces the cached token to expire,
then verifies refresh and reconnection. Run it with the same application-managed
IAM settings and a proxy that passes through application credentials:

```bash
unset CLOUD_SQL_TCP_PASSWORD
export CLOUD_SQL_TCP_IAM_AUTH=true
poetry run pytest tests/integration/test_tcp_connector_integration.py::TestLocalTCPIntegration::test_iam_token_refresh -v
```

**Troubleshooting:**
- If tests are skipped, ensure `CLOUD_SQL_INSTANCE` is set in your `.env` file
- If tests fail with authentication errors, verify your Google Cloud credentials
- If tests fail with connection errors, check your Cloud SQL instance is running and accessible


### Code Formatting

```bash
poetry run black .
```

## License

Copyright © 2025 Province of British Columbia

Licensed under the BSD 3 Clause License, (the "License"); you may not use this file except in compliance with the License. The template for the license can be found here https://opensource.org/license/bsd-3-clause/

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
