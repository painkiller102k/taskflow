import logging
import json
import os
from datetime import datetime

# 📁 гарантируем что папка существует
LOG_DIR = "/app/logs"
LOG_FILE = f"{LOG_DIR}/app.log"

os.makedirs(LOG_DIR, exist_ok=True)

# 📄 создаём файл если его нет
open(LOG_FILE, "a").close()

# logger
logger = logging.getLogger("taskflow")
logger.setLevel(logging.INFO)

# чтобы не дублировались хендлеры при reload
if not logger.handlers:
    file_handler = logging.FileHandler(LOG_FILE)
    file_handler.setFormatter(logging.Formatter("%(message)s"))
    logger.addHandler(file_handler)


def log_event(level, message, service="TaskFlow_API", metadata=None):
    log_data = {
        "level": level,
        "message": message,
        "service": service,
        "timestamp": datetime.utcnow().isoformat(),
        "metadata": metadata or {}
    }

    logger.info(json.dumps(log_data))