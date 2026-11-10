from time import perf_counter
from statistics import median
from algorithms.bfs import bfs
from algorithms.dijkstra import dijkstra
from algorithms.astar import astar

algorithms = [
    ("BFS", bfs),
    ("Dijkstra", dijkstra),
    ("A*", astar)
]

scenario = "single_wall"

for size in [5, 10, 20, 50]:
    
    if scenario == "empty":
        blocked = set()
    elif scenario == "single_wall":
        blocked = {
            (row, size//2)
            for row in range (size -1)
        }
    elif scenario == "zigzag":
        blocked = {
            (row, size//3)
            for row in range (size -1)
        }

        blocked.update({
            (row, (size*2)//3)
            for row in range(1, size)
        })

    print(f"\nGrid: {size}x{size}")
    for name, algorithm in algorithms:
        times = []

        for i in range (10):
            algorithm((0,0), (size -1, size -1), blocked, size, size)

        for i in range (50):
            start_time = perf_counter()

            algorithm((0,0), (size -1, size -1), blocked, size, size)

            elapsed = (perf_counter() -start_time) * 1000
            times.append(elapsed)

        print(name, "median:", round(median(times), 3), "ms")
        result = algorithm(
            (0,0), (size -1, size -1), blocked, size, size
        ) 
        print("Path cells:", len(result["path"]))
        print("Explored cells:", len(result["explored"]))