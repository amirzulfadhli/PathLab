let rows = 5
let cols = 5

const grid = document.getElementById("grid");

function createGrid() {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
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
            });

            grid.appendChild(cell);
        }
    }
}

createGrid();

function resetStatistics() {
        document.getElementById("pathMoves").textContent = "-";
        document.getElementById("exploredCount").textContent = "-";
        document.getElementById("totalCells").textContent = rows * cols;
    }

const runButton = document.getElementById("runBFS");

runButton.addEventListener("click", async() => {
    runButton.disabled = true;
    gridSize.disabled = true;
    resetButton.disabled = true;
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
});

const gridSize = document.getElementById("gridSize");

function updateGridSize (){
    const size = Number(gridSize.value);

    rows = size;
    cols = size;

    createGrid();
    resetStatistics();
    document.getElementById("resultStatus").textContent = "";
    console.log("Grid updated:", rows, cols);
}

gridSize.addEventListener("change", updateGridSize);


updateGridSize();