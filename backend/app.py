# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

logs = []

@app.route("/log", methods=["POST"])
def log():
    data = request.json
    data["timestamp"] = datetime.datetime.now().isoformat()
    logs.append(data)
    return jsonify({"status": "ok", "data": data})

@app.route("/logs", methods=["GET"])
def get_logs():
    return jsonify(logs)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
