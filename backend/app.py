from flask import Flask, jsonify, request
from algorithms.bfs import bfs

app = Flask(__name__, static_folder="../frontend", static_url_path="")

@app.get("/")
def home():
    return app.send_static_file("index.html")

@app.post("/api/bfs")
def run_bfs():
    data = request.get_json()

    blocked = {tuple(cell) for cell in data ["blocked"]}

    path = bfs((0,0), (4,4), blocked)

    return jsonify({"path": path})

if __name__ == "__main__":
    app.run(debug = True)