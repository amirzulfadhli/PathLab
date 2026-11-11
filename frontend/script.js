let rows = 5
let cols = 5

const grid = document.getElementById("grid");
const mazePreset = document.getElementById("mazePreset");
let previousPreset = mazePreset.value;

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
                mazePreset.value = "custom";
                previousPreset = "custom";
                resetStatistics();
                resetComparison();
            });

            grid.appendChild(cell);
        }
    }
}

function hasValidPath() {
    const cells = document.querySelectorAll("#grid .cell");
    const qeue = [0];
    const visited =  new Set([0]);
    const goal = rows*cols -1;

    let head = 0;

    while(head < qeue.length) {
        const current = qeue[head++];

        if(current === goal) {
            return true;
        }

        const row = Math.floor(current/cols);
        const column = current%cols;

        const neighbors = [
            [row -1, column],
            [row +1, column],
            [row, column -1],
            [row, column +1]
        ];

        for (const [r, c] of neighbors) {
            if (r <  0 || r >= rows || c < 0 || c >= cols) {
                continue;
            }

            const index = r*cols + c;

            if (visited.has(index) || cells[index].classList.contains("wall")) {
                continue;
            }

            visited.add(index);
            qeue.push(index);
        }
    }
    return false;
}

createGrid();
if (mazePreset.value === "custom") {
    mazePreset.value = "empty";
}

document.getElementById("mazePreset").addEventListener("change", (event) => {
    const preset = event.target.value;

    if(event.isTrusted && previousPreset === "custom") {
        const confirmed = confirm (
            "Switching preset will delete your custom maze. Continue?"
        );

        if(!confirmed) {
            mazePreset.value = previousPreset;
            return;
        }
    }
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
    else if(preset === "random") {
        const cells = document.querySelectorAll("#grid .cell");
        let solvable = false;

        for (let attempt = 0; attempt < 30; attempt++) {

            cells.forEach(cell => {
                cell.classList.remove("wall");

                if (cell.classList.contains("start") || cell.classList.contains("end")) {
                    return;
                }
                if (Math.random() < 0.25){
                    cell.classList.add("wall");
                }
            });
            if (hasValidPath()) {
                solvable = true;
                break;
            }
        }
        if (!solvable) {
            cells.forEach(cell => cells.classList.remove("wall"));
        }
    }
    resetComparison();
    previousPreset = mazePreset.value;
    regenerateButton.disabled = mazePreset.value !== "random";
});

function resetStatistics() {
        document.getElementById("pathMoves").textContent = "-";
        document.getElementById("exploredCount").textContent = "-";
        document.getElementById("totalCells").textContent = rows * cols;
    }

const runButton = document.getElementById("runBFS");
const regenerateButton = document.getElementById("regenerateMaze");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

let isPaused = false;
let stopRequested = false;

pauseButton.addEventListener("click", async() => {
    isPaused = !isPaused;

    pauseButton.textContent = isPaused ?  "Resume" : "Pause";
});

stopButton.addEventListener("click", () => {
    stopRequested = true;
    isPaused = false;

    pauseButton.disabled = true;
    pauseButton.textContent = "Pause";

    document.getElementById("resultStatus").textContent = "Animation Stopped";
});

async function waitIfPause() {
    while (isPaused && !stopRequested) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function animationDelay(ms) {
    let elapsed = 0;

    while (elapsed < ms &&  !stopRequested) {
        await waitIfPause();

        if (stopRequested) return;

        const interval =  Math.min(25, ms - elapsed);

        await new Promise(resolve => setTimeout(resolve, interval));

        elapsed += interval;
    }
}

runButton.addEventListener("click", async() => {
    runButton.disabled = true;
    gridSize.disabled = true;
    resetButton.disabled = true;
    mazePreset.disabled = true;
    compareButton.disabled = true;
    regenerateButton.disabled = true;
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

        isPaused = false;
        stopRequested = false;
        stopButton.disabled = false;
        pauseButton.disabled = false;

        for(const [row, column] of data.explored){
            await waitIfPause();

            if (stopRequested) break;
            const index = row * cols + column;
            const cell = cells[index];

            if(!cell.classList.contains("start") && !cell.classList.contains("end") && !cell.classList.contains("wall")) {
                cell.classList.add("explored");
            }
            await animationDelay(speed);
        }

        for (const [row, column] of data.path) {
            await waitIfPause();

            if (stopRequested) break;
            const index = row*cols + column;
            const cell =  cells[index]

            if(!cell.classList.contains("start") && !cell.classList.contains("end")) {
                cell.classList.add("path");
            }
            await animationDelay(speed);
        };
    } finally {
        if (stopRequested) {
            document.querySelectorAll(".cell.path, .cell.explored").forEach(cell => {
                cell.classList.remove("path", "explored");
            });
            resetStatistics();
        }

        isPaused = false;
        stopRequested = false;

        stopButton.disabled = true;
        pauseButton.disabled = true;
        pauseButton.textContent = "Pause";

        runButton.disabled = false;
        gridSize.disabled = false;
        resetButton.disabled = false;
        mazePreset.disabled = false;
        compareButton.disabled = false;
        regenerateButton.disabled = mazePreset.value !== "random";
    }
})

const resetButton = document.getElementById("resetGrid");

resetButton.addEventListener("click", () => {
    if(runButton.disabled){
            return;
        }
    
    if(mazePreset.value === "custom") {
        const confirmed = confirm (
            "Reseting will reset your custom maze. Continue?"
        );
        if(!confirmed) {
            return;
        }
    }

    document.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("wall", "path", "explored");
    });

    mazePreset.value = "empty";
    previousPreset = "empty";
    regenerateButton.disabled = true;

    document.getElementById("resultStatus").textContent = "";

    resetStatistics();
    resetComparison();
});

const gridSize = document.getElementById("gridSize");

function updateGridSize (){
    const size = Number(gridSize.value);

    rows = size;
    cols = size;

    if (mazePreset.value === "custom") {
    mazePreset.value = "empty";
    regenerateButton.disabled = true;
    }

    document.getElementById("mazePreset").dispatchEvent(new Event("change"));
    resetStatistics();
    resetComparison();
    document.getElementById("resultStatus").textContent = "";
    console.log("Grid updated:", rows, cols);
}

gridSize.addEventListener("change", () => {
    if (mazePreset.value === "custom") {
        const confirmed = confirm (
            "Resizing will reset your custom maze. Continue?"
        );

        if (!confirmed) {
            gridSize.value = String(rows);
            return;
        }
    }
    updateGridSize();
});

updateGridSize();

const compareButton = document.getElementById("compareAlgorithm");

compareButton.addEventListener("click", async () => {
    if (runButton.disabled) return;
    
    runButton.disabled = true;
    compareButton.disabled = true;
    gridSize.disabled = true;
    resetButton.disabled = true;
    mazePreset.disabled = true;
    regenerateButton.disabled = true;

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

            const barTrack =  document.getElementById(`${result.algorithm}Bar`).parentElement;

            barTrack.title = `${result.algorithm.toUpperCase()}: ${result.explored}/${rows*cols} cells explored (${percentage.toFixed(1)}%)`;

            document.getElementById(`${result.algorithm}Bar`).style.width = `${percentage}%`;
            document.getElementById(`${result.algorithm}BarValue`).textContent = `${percentage.toFixed(1)}%`;
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
        regenerateButton.disabled = mazePreset.value !=="random";
    }
});

regenerateButton.addEventListener("click", () => {
    if (runButton.disabled ||  mazePreset.value !== "random") {
        return;
    }
    mazePreset.dispatchEvent(new Event("change"));
});

function resetComparison() {
    const algorithms = ["bfs", "dijkstra", "astar"];

    algorithms.forEach(algorithm => {
        document.getElementById(`${algorithm}Moves`).textContent = "-";
        document.getElementById(`${algorithm}Explored`).textContent = "-";
        document.getElementById(`${algorithm}Percent`).textContent = "-";
        document.getElementById(`${algorithm}Time`).textContent = "-";

        document.getElementById(`${algorithm}Bar`).style.width = "0%";
        document.getElementById(`${algorithm}BarValue`).textContent = "-"
        document.getElementById(`${algorithm}Explored`).classList.remove("best-explored");
        document.getElementById(`${algorithm}Time`).classList.remove("best-time");
        document.getElementById(`${algorithm}Bar`).parentElement.removeAttribute("title");
    });
}