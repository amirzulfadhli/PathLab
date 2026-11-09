import heapq
from .bfs import get_neighbors, is_valid

def astar(start, end, blocked = None, grid_rows = 5, grid_cols = 5):
    g_cost = {start: 0}
    parents = {start: None}
    explored = []

    if not is_valid(*start, blocked, grid_rows, grid_cols):
        return {"path": [], "explored": []}
    if not is_valid(*end, blocked, grid_rows, grid_cols):
        return {"path": [], "explored": []}

    start_h = heuristic(start, end)
    qeue = [(start_h, start_h, start)]

    while qeue:
        current_f, current_h, current = heapq.heappop(qeue)

        if current_f > g_cost[current] + heuristic(current, end):
            continue
        explored.append(current)

        if  current == end:
            path = []
            node = current

            while node is not None:
                path.append(node)
                node = parents[node]

            path.reverse()
            print("Shortest path:", path)
            print("Explored cells:", len(explored))
            return {
                "path": path,
                "explored": explored
            }

            print("Destination reached:", current)
            print("Minimum cost:", g_cost[current])
            break

        for neighbour in get_neighbors(*current, blocked, grid_rows, grid_cols):
            new_g = g_cost[current] + 1
            new_h = heuristic(neighbour, end)
            new_f = new_g + new_h

            if neighbour not in g_cost or new_g < g_cost[neighbour]:
                g_cost[neighbour] = new_g
                parents[neighbour] = current
                heapq.heappush(qeue, (new_f, new_h, neighbour))
                
    print("Destination discorvered:", end in g_cost)
    print("Destination cost:", g_cost.get(end))

    return {
        "path": [],
        "explored": explored
    }

def heuristic(current, end):
    row_distance = abs(current[0] - end[0])
    col_distance = abs(current[1] - end[1])

    return row_distance + col_distance

if __name__ == "__main__":
    for size in [5, 10, 20]:
        result = astar((0,0),(size -1, size -1), set(), size, size)
    
        print(f"{size}x{size}: {len(result['path'])} cells")

    print("Blocked start:", astar((0,0), (4,4), {(0,0)}))
    print("Blocked end:", astar((0,0), (4,4), {(4,4)}))
    print("Outside grid:", astar((0,0), (8,8), set(), 5, 5))