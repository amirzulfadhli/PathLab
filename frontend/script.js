let rows = 5
let cols = 5

const grid = document.getElementById("grid");

function createGrid() {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    grid.style.maxWidth = `${Math.min(cols * 50, 720)}px`;

    for (let row = 0; row < rows; row++){
        for (let column = 0; column < cols; column++){
            const cell = document.createElement("div");
            cell.className = "cell";

            if (row == 0 && column == 0) {
                cell.classList.add("start")
            }
            if (row == rows - 1 && column == cols - 1) {
                cell.classList.add("end")
            }

            cell.addEventListener("click", () =>{
                if (cell.classList.contains("start") || cell.classList.contains("end")) {
                    return
                }
                if (runButton.disabled){
                    return;
                }
                document.querySelectorAll(".path, .explored").forEach(cell => {
                    cell.classList.remove("path", "explored");
                });
                document.getElementById("resultStatus").textContent = "";
                cell.classList.toggle("wall");
                resetStatistics();
                resetComparison();
            });

            grid.appendChild(cell);
        }
    }
}

createGrid();

document.getElementById("mazePreset").addEventListener("change", (event) => {
    const preset = event.target.value;

    createGrid();

    if(preset === "single_wall") {
        const cells = document.querySelectorAll("#grid .cell");
        const wallColumn = Math.floor(cols/2);

        for(let row = 0; row < rows -1; row++) {
            const index = row*cols + wallColumn;
            cells[index].classList.add("wall");
        }
    }
    else if(preset === "zigzag") {
        const cells = document.querySelectorAll("#grid .cell");

        const firstWall = Math.floor(cols/3);
        const secondWall = Math.floor((cols*2)/3);

        for(let row = 0; row < rows -1; row++) {
            const index = row*cols + firstWall;
            cells[index].classList.add("wall");
        }

        for(let row = 1; row < rows; row++) {
            const index = row*cols + secondWall;
            cells[index].classList.add("wall");
        }
    }
    resetComparison();
});

function resetStatistics() {
        document.getElementById("pathMoves").textContent = "-";
        document.getElementById("exploredCount").textContent = "-";
        document.getElementById("totalCells").textContent = rows * cols;
    }

const runButton = document.getElementById("runBFS");
const mazePreset = document.getElementById("mazePreset");

runButton.addEventListener("click", async() => {
    runButton.disabled = true;
    gridSize.disabled = true;
    resetButton.disabled = true;
    mazePreset.disabled = true;
    compareButton.disabled = true;
    const blocked =[];

    try {
        const algorithm = document.getElementById("algorithm").value;
        
        console.log("Selected algorithm:", algorithm);

        const speed = Number (
            document.getElementById("animationSpeed").value
        );

        document.querySelectorAll(".cell").forEach((cell, index) => {
            if (cell.classList.contains("wall")) {
                const row = Math.floor(index/ cols);
                const column = index % cols;

                blocked.push([row, column]);
            }
        });

        console.log("Blocked cells: ", blocked);

        const response = await fetch("/api/bfs", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                blocked: blocked,
                size: rows,
                algorithm: algorithm
            })
        })
            
        const data = await response.json();

        document.getElementById("pathMoves").textContent = data.path.length > 0? data.path.length -1 : "-";
        document.getElementById("exploredCount").textContent = data.explored.length;
        document.getElementById("totalCells").textContent = rows * cols;

        console.log("Explored received:", data.explored?.length);
        console.log("Received path length:", data.path.length);
        console.log("Last position:", data.path.at(-1));
        console.log("Grid cells:", document.querySelectorAll(".cell").length);
        console.log("Shortest path: ", data.path)

        const cells = document.querySelectorAll(".cell");

        const status = document.getElementById("resultStatus");

        if(data.path.length ===0) {
            status.textContent = "No path found:";
            return;
        }

        status.textContent = `Shortest path: ${data.path.length - 1}`;

        cells.forEach(cell => {
            cell.classList.remove("path", "explored");
        });

        for(const [row, column] of data.explored){
            const index = row * cols + column;
            const cell = cells[index];

            if(!cell.classList.contains("start") && !cell.classList.contains("end") && !cell.classList.contains("wall")) {
                cell.classList.add("explored");
            }
            await new Promise(resolve => setTimeout(resolve, speed));
        }

        for (const [row, column] of data.path) {
            const index = row*cols + column;
            const cell =  cells[index]

            if(!cell.classList.contains("start") && !cell.classList.contains("end")) {
                cell.classList.add("path");
            }
            await new Promise(resolve => setTimeout(resolve, speed));
        };
    } finally {
        runButton.disabled = false;
        gridSize.disabled = false;
        resetButton.disabled = false;
        mazePreset.disabled = false;
        compareButton.disabled = false;
    }
})

const resetButton = document.getElementById("resetGrid");

resetButton.addEventListener("click", () => {
    if(runButton.disabled){
        return;
    }

    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("wall", "path", "explored");
    });
    document.getElementById("resultStatus").textContent = "";

    resetStatistics();
    resetComparison();
});

const gridSize = document.getElementById("gridSize");

function updateGridSize (){
    const size = Number(gridSize.value);

    rows = size;
    cols = size;

    document.getElementById("mazePreset").dispatchEvent(new Event("change"));
    resetStatistics();
    resetComparison();
    document.getElementById("resultStatus").textContent = "";
    console.log("Grid updated:", rows, cols);
}

gridSize.addEventListener("change", updateGridSize);

updateGridSize();

const compareButton = document.getElementById("compareAlgorithm");

compareButton.addEventListener("click", async () => {
    if (runButton.disabled) return;
    
    runButton.disabled = true;
    compareButton.disabled = true;
    gridSize.disabled = true;
    resetButton.disabled = true;
    mazePreset.disabled = true;

    try {
        const blocked = [];

        document.querySelectorAll(".cell").forEach((cell, index) => {
            if (cell.classList.contains("wall")) {
                const row = Math.floor(index/cols);
                const column = index%cols;

                blocked.push([row, column]);
            }
        });
        
        const algorithms = ["bfs", "dijkstra", "astar"];

        const result = await Promise.all(
            algorithms.map(async (algorithm) => {
                const response = await fetch("/api/bfs", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        blocked: blocked,
                        size: rows,
                        algorithm: algorithm
                    })
                });

                if(!response.ok) {
                    throw new Error(`${algorithm}: HTTP ${response.status}`);
                }

                const data = await response.json();

                return {
                    algorithm: algorithm,
                    moves: data.path.length > 0? data.path.length -1 : null,
                    explored: data.explored.length,
                    execution_ms: data.execution_ms
                };
            })
        );

        console.table(result);
        const minExplored = Math.min(
            ...result.map(item => item.explored)
        );
        const minTime = Math.min(
            ...result.map(item => item.execution_ms)
        );

        result.forEach(result => {
            const movesCell = document.getElementById(`${result.algorithm}Moves`);
            const exploredCell = document.getElementById(`${result.algorithm}Explored`);

            movesCell.textContent =  result.moves ?? "-";
            exploredCell.textContent = result.explored === minExplored? `${result.explored}★`:  result.explored;
            exploredCell.classList.toggle(
                "best-explored",
                result.explored === minExplored
            );

            const percentage = (result.explored/(rows*cols)) * 100;

            document.getElementById(`${result.algorithm}Bar`).style.width = `${percentage}%`;
            document.getElementById(`${result.algorithm}Percent`).textContent = `${percentage.toFixed(1)}%`;

            const timeCell = document.getElementById(`${result.algorithm}Time`)

            timeCell.textContent = `${result.execution_ms.toFixed(3)}${result.execution_ms === minTime? "★": ""}`;
            timeCell.classList.toggle(
                "best-time",
                result.execution_ms === minTime
            )

            document.getElementById("resultStatus").textContent = "Comparing algorithms...";
        })

    } catch (error) {
        console.error("Comparison failed:", error);

        resetComparison();

        document.getElementById("resultStatus").textContent = "Comparison failed. Please check the server and try again";
    } finally {
        runButton.disabled = false;
        compareButton.disabled = false;
        gridSize.disabled = false;
        resetButton.disabled = false;
        mazePreset.disabled = false;
    }
});

function resetComparison() {
    const algorithms = ["bfs", "dijkstra", "astar"];

    algorithms.forEach(algorithm => {
        document.getElementById(`${algorithm}Moves`).textContent = "-";
        document.getElementById(`${algorithm}Explored`).textContent = "-";
        document.getElementById(`${algorithm}Percent`).textContent = "-";
        document.getElementById(`${algorithm}Time`).textContent = "-";

        document.getElementById(`${algorithm}Bar`).style.width = "0%";
        document.getElementById(`${algorithm}Explored`).classList.remove("best-explored");
        document.getElementById(`${algorithm}Time`).classList.remove("best-time");
    });
}