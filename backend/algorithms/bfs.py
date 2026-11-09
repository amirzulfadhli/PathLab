from collections import deque

rows = 5
column = 5

start = (0,0)
end = (4,4)

obstacles = {(1,2),(2,2)}

directions = [
    (-1, 0), #up
    (1, 0),  #down
    (0, -1), #right
    (0, 1),  #left
]

def is_valid(row, col, blocked=None, grid_rows=5, grid_cols=5):
    if blocked is None:
        blocked = obstacles
    if row < 0 or row >= grid_rows:
        return False    
    if col < 0 or col >= grid_cols:
        return False    
    if (row, col) in blocked:
        return False        
    return True

def get_neighbors(row, col, blocked = None, grid_rows=5, grid_cols=5):
    neighbors = []
    
    for dr, dc in directions:
        new_row = row + dr
        new_column = col + dc
    
        if is_valid(new_row, new_column, blocked, grid_rows, grid_cols):
            neighbors.append((new_row, new_column))
    return neighbors

def bfs(start, end, blocked = None, grid_rows = 5, grid_cols = 5):

    if not is_valid(*start, blocked, grid_rows, grid_cols):
        return {"path": [], "explored": []}
    if not is_valid(*end, blocked, grid_rows, grid_cols):
        return {"path": [], "explored": []}

    qeue = deque([start])
    visited = {start}
    parents = {start: None}
    explored = []

    while(qeue):
        current = qeue.popleft()
        explored.append(current)
        if current == end:
            path = []
            node = current

            while node is not None:
                path.append(node)
                node = parents[node]

            path.reverse()
            return {
                "path": path,
                "explored": explored
            }

        for neighbor in get_neighbors(*current, blocked, grid_rows, grid_cols):
            if neighbor not in visited:
                parents[neighbor] = current   
                visited.add(neighbor)
                qeue.append(neighbor)
    return {
        "path": [],
        "explored": explored
    }

if __name__ == "__main__":
    result = bfs(start, end, set())

    for size in [5,10,20]:
        result = bfs((0,0), (size -1, size -1), set(), size, size)

        print(f"{size}x{size}")
        print("Path length:", len(result["path"]))
        print("Explored cells:", len(result["explored"]))

    print("Blocked start:", bfs((0, 0), (4, 4), {(0, 0)}))
    print("Blocked end:", bfs((0, 0), (4, 4), {(4, 4)}))
    print("Outside grid:", bfs((0, 0), (8, 8), set(), 5, 5))


