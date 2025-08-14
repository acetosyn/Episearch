from flask import Flask, render_template, jsonify, send_from_directory
import json
import os

app = Flask(__name__)

DATA_PATH = os.path.join(app.root_path, "data", "tests.json")

def load_tests():
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/tests")
def api_tests():
    return jsonify(load_tests())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
