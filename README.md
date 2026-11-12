# PathLab

An interactive pathfinding algorithm visualizer

PathLab is a web-based application designed to help users understand how pathfinding algorithms work through interactive grid visualizations

Users can create obstacles, generate mazes, visualize the pathfinding process and compare the performance of Breadth-First Search, Dijkstra and A*

The project focuses on making pathfinding algorithms easier to understand by demonstrating how different algorithms explore a grid and determine the shortest path

## Objectives

1. Visualize how Breadth-First Search, Dijkstra and A* explore a grid and find the shortest path
2. Allow users to interact with the grid by adding or removing obstacles
3. Provide predefined and randomly generated mazes for testing pathfinding algorithms
4. Compare algorithm performance based on path length, explored cells and execution time
5. Help users understanf pathfinding behavior through animations and interactive controls

## Features

### Interactive Grid

- Supports 5x5, 10x10 and 20x20 grid sizes
- Add or remove obstacles by clicking grid cells
- Reset the grid to start new visualization

### Pathfinding Algorithms

- Breadth-First Search - Explores nodes level by level
- Dijkstra - Finds the shortest path using distance based exploration
- A* - Uses a heuristic to guide the search toward the destination

### Algorithm Visualization

- Animated exploration of grid cells
- Highlights the shortest path found
- Adjustable animation speed
- Pause, Resume and Stop controls

### Maze Generation

- Empty grid, single wall and zigzag maze presets
- Random maze generation with a guaranteed valid path
- Regenerate random mazes
- Create and modify custom layouts

### Algorithm comparison

- Compare BFS, Dijkstra and A*
- Display shortest path length, explored cells and execution time
- Visualize exploration percentages using bar charts
- Highligh the best results for exploration efficiency and execution time

### Reliability

- Input validation for API requests
- Error messages when the backend is unavailable
- Recovery from failed requests wihtout refreshing the webpage

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Python | Pathfinding algorithm implementation |
| HTML | Webpage structure |
| CSS | Interface styling and responsive layout |
| JavaScript | Grid interactions, animations and API requests |
|Flask 3.1.3 | Backend server and REST API |
| Python unittest | Automated algorithm and API testing |

## Architecture

PathLab uses a lighweight frontend-backend architecture:

1. Users interact with the grid through the browser
2. JavaScript sends pathfinding requests to the Flask API
3. Python executes the selected pathfinding algorithm
4. Flask returns the explored cells, shortest path and execution time
5. JavaScript visualizes the results on the grid

## Installation and Setup

### Prerequisites

- Python 3
- Git
- Web browser

### 1. Clone the repository

```powershell
git clone https://github.com/amirzulfadhli/PathLab.git
```
```powershell
cd PathLab
```

### 2. Create a Virtual Environment

For Windows PowerShell:

```powershell
python -m venv .venv
```

### 3. Install Dependencies

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 4. Start the Application

```powershell
.\.venv\Scripts\python.exe backend/app.py
```

### 5. Open PathLab

Open your browser and visit:

http://127.0.0.1:5000

You can now interact with the grid, generate mazes visualize pathfinding and compare their performance

To stop the server, press Ctrl + C in the terminal

## Testing

PathLab uses Python's built in unittest framework to verify the pathfinding algortithms and Flask API

### Run All Tests

From the project root, run:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

### Test Coverage

| Category | Tests |
| --- | --- |
| BFS algorithm | 6 |
| Dijkstra algorithm | 6 |
| A* algorithm | 6 |
| Flask API | 13 |
| Total | 31 |

The automated tests cover:

- Shortest path calculation
- Blocked starting and destination cells
- Unreachable destinations
- Valid obstacle handling
- Invalid API inputs and error responses

### Performance Benchmarking

PathLab also includes a benchmark script for comparing algorithm execution times

Run:

```powershell
.\.venv\Scripts\python.exe backend/benchmark.py
```

The benchmark evaluates BFS, Dijkstra and A* across different grid sizes and obstacle configurations

## Project Structure

```text
PathLab/
├── backend/
│   ├── app.py
│   ├── benchmark.py
│   └── ...                 # Pathfinding algorithms
├── frontend/
│   ├── script.js
│   └── ...                 # HTML and CSS files
├── tests/
│   ├── test_algorithms.py
│   └── test_api.py
├── requirements.txt
└── README.md
```

### Directory Overview

- backend/ - contains the Flask API, pathfinding algorithms and performance benchmarks
- frontend/ - contains the website interface, grid interactions, animations and visualizations
- tests/ - contains automated tests for algorithm correctness and API validation
- requirements.txt - lists the required Python dependencies

### How to use PathLab

1. Select grid size - choose a 5x5, 10x10 or 20x20 grid
2. Choose an algorithm - select BFS, Dijkstra or A*
3. Customize the grid - add/remove obstacles by clicking cells or select a predefined maze
4. Run the visualization - start the algorithm to observe explored cells and the shortest path
5. Control the animation - adjust the animation speed, pause, resume or stop the visualization
6. Compare algorithms - use compare algorithms to examine path lengths, explored cells and execution times

### Understanding the Results

- Shortest path length - number of moves required to reach the destination
- Explored cells - number of cells examined during the search
- Execution time - time taken by the backend algorithm, measured in milliseconds

A smaller explored cell count can indicate a more focused search. Execution times may vary between runs depending on the algorithm and grid configuration
