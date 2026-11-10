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
    print("Received grid size:", data.get("size"))

    blocked = {tuple(cell) for cell in data ["blocked"]}

    size = data.get("size", 5)

    if size not in (5, 10, 20):
        return jsonify({"error": "Invalid grid size"}), 400

    algorithm = data.get("algorithm", "bfs")
    print("API selected algorithm", algorithm)

    start_time = perf_counter()

    if algorithm == "bfs":
        result = bfs((0, 0), (size -1, size -1), blocked, size, size)
    elif algorithm == "dijkstra":
        result = dijkstra((0, 0), (size -1, size -1), blocked, size, size)
    elif algorithm == "astar":
        print("Executing A* algortihm")
        result = astar((0,0), (size -1, size -1), blocked, size, size)
    else:

        return jsonify({"error": "Invalid algorithm"}), 400

    print("Returned path length:", len(result["path"]))
    print("Last position:", result["path"][-1] if result["path"] else None)

    execution_ms = (perf_counter() - start_time) * 1000

    result["execution_ms"] = round(execution_ms, 3)
    print("Execution time:", result["execution_ms"], "ms")

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug = True)