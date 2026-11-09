import heapq
from .bfs import get_neighbors, is_valid

qeue = []


def dijkstra(start, end, blocked = None, grid_rows = 5, grid_cols = 5):
    qeue = [(0, start)]
    distances = {start: 0}
    parents = {start: None}
    explored = []

    if not is_valid(*start, blocked, grid_rows, grid_cols):
        return {"path": [], "explored": []}
    if not is_valid(*end, blocked, grid_rows, grid_cols):
        return {"path": [], "explored": []}

    while qeue:
        current_cost, current = heapq.heappop(qeue)

        if current_cost > distances[current]:
            continue
    
        explored.append(current)
        if current == end:
            path = []
            node = current

            while node is not None:
                path.append(node)
                node = parents[node]

            path.reverse()
            print("Shortest path:", path)
            return {
                "path": path,
                "explored": explored
            }

        for neighbors in get_neighbors(*current, blocked, grid_rows, grid_cols):
            new_cost = current_cost + 1

            if neighbors not in distances or new_cost < distances[neighbors]:
                distances[neighbors] = new_cost
                parents[neighbors] = current
                heapq.heappush(qeue, (new_cost, neighbors))

    return {
        "path": [],
        "explored": explored
    }
    print("disntaces:", distances)

if __name__ == "__main__":
    for size in [5, 10, 20]:
        result = dijkstra((0,0),(size -1, size -1), set(), size, size)

        print(f"{size}x{size}: {len(result['path'])} cells")

    print("Path lenght:", len(result["path"]))
    print("Explored cell:", len(result["explored"]))
    print("Blocked start:", dijkstra((0, 0), (4, 4), {(0, 0)}))
    print("Blocked end:", dijkstra((0, 0), (4, 4), {(4, 4)}))
    print("Outside grid:", dijkstra((0, 0), (8, 8), set(), 5, 5))
