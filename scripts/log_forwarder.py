import time
import json
import os
import requests

# =========================
# CONFIG
# =========================

LOG_FILE = "/logs/app.log"
ELASTIC_URL = "http://elasticsearch:9200/taskflow-logs/_doc"

# =========================
# ELASTIC SENDER
# =========================

def send_to_elastic(log):
    try:
        response = requests.post(
            ELASTIC_URL,
            json=log,
            timeout=3
        )

        if response.status_code >= 300:
            print("❌ Elasticsearch error:", response.status_code, response.text)
        else:
            print("✅ Sent to Elasticsearch")

    except Exception as e:
        print("❌ Error sending log:", e)

# =========================
# PARSER
# =========================

def parse_line(line):
    try:
        return json.loads(line.strip())
    except json.JSONDecodeError:
        return None

# =========================
# WAIT FOR FILE
# =========================

def wait_for_file():
    print("⏳ Waiting for log file...")

    while not os.path.exists(LOG_FILE):
        time.sleep(2)

    print("✅ Log file found:", LOG_FILE)

# =========================
# TAIL -F
# =========================

def follow(file):
    file.seek(0, 2)

    while True:
        line = file.readline()

        if not line:
            time.sleep(0.5)
            continue

        yield line

# =========================
# MAIN
# =========================

if __name__ == "__main__":
    wait_for_file()

    print("🚀 Log forwarder started")

    with open(LOG_FILE, "r") as f:
        for line in follow(f):
            log = parse_line(line)

            if log:
                print("📥 Log captured:", log)
                send_to_elastic(log)