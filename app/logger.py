import json
import logging
import os
import queue
import threading
from datetime import datetime

import requests

# Constants
LOG_DIR = "/app/logs"
LOG_FILE = f"{LOG_DIR}/app.log"
SERVICE_NAME = "MMaasikaTest"
LOG_ENDPOINT = "https://srv1073565.hstgr.cloud:8443/api/v1/logs"
HEALTHCHECK_URL = "https://srv1073565.hstgr.cloud:8443/api/v1/health"
HEADERS = {
    "x-api-id": "public",
    "x-api-key": "public",
    "Content-Type": "application/json",
}

os.makedirs(LOG_DIR, exist_ok=True)
open(LOG_FILE, "a").close()


class RemoteHTTPLogHandler(logging.Handler):
    """Отправляет записи логов на внешний HTTP-сервер асинхронно."""

    def __init__(self, endpoint, headers, service, queue_maxsize=1000, timeout=5):
        super().__init__(level=logging.NOTSET)
        self.endpoint = endpoint
        self.headers = headers
        self.service = service
        self.timeout = timeout
        self.queue = queue.Queue(maxsize=queue_maxsize)
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self._stop_event = threading.Event()
        self._worker_thread = threading.Thread(
            target=self._worker,
            name="RemoteHTTPLogHandler",
            daemon=True,
        )
        self._worker_thread.start()

    def emit(self, record):
        try:
            payload = self._build_payload(record)
            self.queue.put_nowait(payload)
        except queue.Full:
            # Не блокируем приложение при переполнении очереди.
            return
        except Exception:
            # Игнорируем любые ошибки логирования.
            return

    def _build_payload(self, record):
        if hasattr(record, "remote_payload") and isinstance(record.remote_payload, dict):
            return record.remote_payload

        metadata = getattr(record, "metadata", {}) or {}
        if isinstance(metadata, str):
            metadata = {"metadata": metadata}

        return {
            "level": record.levelname,
            "message": record.getMessage(),
            "service": self.service,
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": metadata,
        }

    def _worker(self):
        while not self._stop_event.is_set():
            try:
                payload = self.queue.get(timeout=0.5)
            except queue.Empty:
                continue

            try:
                self.session.post(self.endpoint, json=payload, timeout=self.timeout)
            except Exception:
                # Сервер может быть недоступен; продолжаем без падения.
                pass
            finally:
                self.queue.task_done()

    def close(self):
        self._stop_event.set()
        self._worker_thread.join(timeout=1)
        super().close()


def healthcheck():
    """Проверяет доступность внешнего лог-сервера."""
    try:
        response = requests.get(HEALTHCHECK_URL, headers=HEADERS, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception:
        return {"status": "unavailable"}


# === Настройка стандартного логгера ===
logger = logging.getLogger("taskflow")
logger.setLevel(logging.INFO)
logger.propagate = False

if not any(isinstance(handler, logging.FileHandler) for handler in logger.handlers):
    file_handler = logging.FileHandler(LOG_FILE)
    file_handler.setFormatter(logging.Formatter("%(message)s"))
    logger.addHandler(file_handler)

if not any(isinstance(handler, RemoteHTTPLogHandler) for handler in logger.handlers):
    remote_handler = RemoteHTTPLogHandler(
        endpoint=LOG_ENDPOINT,
        headers=HEADERS,
        service=SERVICE_NAME,
    )
    logger.addHandler(remote_handler)


def log_event(level, message, metadata=None):
    normalized_level = (level or "INFO").upper()
    log_data = {
        "level": normalized_level,
        "message": message,
        "service": SERVICE_NAME,
        "timestamp": datetime.utcnow().isoformat(),
        "metadata": metadata or {},
    }

    numeric_level = getattr(logging, normalized_level, logging.INFO)
    logger.log(numeric_level, json.dumps(log_data), extra={"remote_payload": log_data})
