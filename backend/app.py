from flask import Flask, jsonify, request
from algorithms.bfs import bfs
from algorithms.dijkstra import dijkstra
from algorithms.astar import astar
from time import perf_counter

app = Flask(__name__, static_folder="../frontend", static_url_path="")

@app.get("/")
def home():
    return app.send_static_file("index.html")

@app.post("/api/bfs")
def run_bfs():
    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request JSON must be an object"
        }), 400

    size = data.get("size", 5)

    if size not in (5, 10, 20):
        return jsonify({"error": "Invalid grid size"}), 400

    algorithm = data.get("algorithm", "bfs")
    start_time = perf_counter()
    blocked_data = data.get("blocked", [])

    if not isinstance(blocked_data, list):
        return jsonify({
                "error": "Blocked must be a list of coordinates"
        }), 400

    for obstacle in blocked_data:
        if not isinstance(obstacle, (list, tuple)) or len(obstacle) !=2:
            return jsonify({
                "error": "Each obstacle must contain exactly two coordinates"
            }), 400

        row, col = obstacle

        if type(row) is not int or type(col) is not int:
            return jsonify({
                "error": "Obstacle coordinate must be integer"
            }), 400
        if not (0 <= row < size and 0 <= col < size):
            return jsonify({
                "error": "Obstacle coordinate outside the grid"
            }), 400

    blocked = set(map(tuple, blocked_data))

    if algorithm == "bfs":
        result = bfs((0, 0), (size -1, size -1), blocked, size, size)
    elif algorithm == "dijkstra":
        result = dijkstra((0, 0), (size -1, size -1), blocked, size, size)
    elif algorithm == "astar":
        result = astar((0,0), (size -1, size -1), blocked, size, size)
    else:

        return jsonify({"error": "Invalid algorithm"}), 400

    execution_ms = (perf_counter() - start_time) * 1000

    result["execution_ms"] = round(execution_ms, 3)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug = True)