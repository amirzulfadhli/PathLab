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

def is_valid(row, col):
    if row < 0 or row >= rows:
        return False    
    if col < 0 or col >= column:
        return False    
    if (row, col) in obstacles:
        return False        
    return True

def get_neighbors(row, col):
    neighbors = []
    
    for dr, dc in directions:
        new_row = row + dr
        new_column = col + dc
    
        if is_valid(new_row, new_column):
            neighbors.append((new_row, new_column))
    return neighbors

def bfs(start, end):
    qeue = deque([start])
    visited = {start}
    parents = {start: None}

    while(qeue):
        current = qeue.popleft()
        print("exploring: ", current)

        if current == end:
            path = []
            node = current

            while node is not None:
                path.append(node)
                node = parents[node]

            print("Backward path:", path)
            print("Previous vell: ", parents[current])
            print("Destination reached")
            return True

        for neighbor in get_neighbors(*current):
            if neighbor not in visited:
                parents[neighbor] = current   
                visited.add(neighbor)
                qeue.append(neighbor)
    return False

bfs(start, end)
