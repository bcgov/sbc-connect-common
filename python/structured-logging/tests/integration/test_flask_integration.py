"""Integration tests for structured-logging within a live Flask application.

Uses Flask's built-in test client to exercise the full request/response cycle
and validates that log output is valid JSON with the correct GCP Cloud Logging
field names (severity, message, timestamp).

Note: StructuredLogging.get_logger() (static) is only safe to call outside a
request context — inside a request it returns the StructuredLogging instance
instead of the logger because the static method shadows the instance method.
Tests here reflect realistic usage: obtain the logger once at startup.
"""
import json

import pytest
from flask import Flask

from structured_logging import StructuredLogging


def _json_lines(text: str) -> list[dict]:
    """Return only lines that parse as JSON objects."""
    result = []
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("{"):
            try:
                result.append(json.loads(line))
            except json.JSONDecodeError:
                pass
    return result


# ---------------------------------------------------------------------------
# Test 1 – log emitted during a real request is valid JSON with correct fields
# ---------------------------------------------------------------------------

def test_request_log_is_valid_json(capsys):
    app = Flask(__name__)
    app.config["STRUCTURED_LOG_LEVEL"] = "INFO"
    slog = StructuredLogging(app)
    logger = slog.get_logger()

    @app.route("/")
    def index():
        logger.info("handling request")
        return {"status": "ok"}, 200

    with app.test_client() as client:
        resp = client.get("/")

    assert resp.status_code == 200

    records = _json_lines(capsys.readouterr().out)
    assert records, "No JSON log lines captured"

    record = next(r for r in records if r.get("message") == "handling request")
    assert record["severity"] == "info"
    assert "timestamp" in record


# ---------------------------------------------------------------------------
# Test 2 – warning and error logs carry the correct severity field
# ---------------------------------------------------------------------------

def test_severity_fields_for_warning_and_error(capsys):
    app = Flask(__name__)
    app.config["STRUCTURED_LOG_LEVEL"] = "WARNING"
    slog = StructuredLogging(app)
    logger = slog.get_logger()

    @app.route("/levels")
    def levels():
        logger.warning("a warning")
        logger.error("an error")
        return {}, 200

    with app.test_client() as client:
        client.get("/levels")

    records = _json_lines(capsys.readouterr().out)
    by_msg = {r["message"]: r["severity"] for r in records}

    assert by_msg.get("a warning") == "warning"
    assert by_msg.get("an error") == "error"


# ---------------------------------------------------------------------------
# Test 3 – multiple log calls in one request all emit valid JSON
# ---------------------------------------------------------------------------

def test_multiple_logs_per_request(capsys):
    app = Flask(__name__)
    app.config["STRUCTURED_LOG_LEVEL"] = "DEBUG"
    slog = StructuredLogging(app)
    logger = slog.get_logger()

    @app.route("/multi")
    def multi():
        logger.info("step one")
        logger.warning("step two")
        logger.error("step three")
        return {}, 200

    with app.test_client() as client:
        client.get("/multi")

    records = _json_lines(capsys.readouterr().out)
    by_msg = {r["message"]: r["severity"] for r in records}

    assert by_msg.get("step one") == "info"
    assert by_msg.get("step two") == "warning"
    assert by_msg.get("step three") == "error"


# ---------------------------------------------------------------------------
# Test 4 – late init_app (factory pattern) still produces structured logs
# ---------------------------------------------------------------------------

def test_factory_pattern_init_app(capsys):
    slog = StructuredLogging()

    app = Flask(__name__)
    app.config["STRUCTURED_LOG_LEVEL"] = "INFO"
    slog.init_app(app)

    logger = slog.get_logger()

    @app.route("/factory")
    def factory_route():
        logger.info("factory init works")
        return {}, 200

    with app.test_client() as client:
        resp = client.get("/factory")

    assert resp.status_code == 200

    records = _json_lines(capsys.readouterr().out)
    assert records, "No JSON log lines captured"

    record = next(r for r in records if r.get("message") == "factory init works")
    assert record["severity"] == "info"
    assert "timestamp" in record
