const rows = 5
const cols = 5

const grid = document.getElementById("grid");

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
            cell.classList.toggle("wall");
        })

        grid.appendChild(cell);
    }
}

const runButton = document.getElementById("runBFS");

runButton.addEventListener("click", async() => {
    const blocked =[];

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
        body: JSON.stringify({blocked: blocked})
    })
        
    const data = await response.json();

    console.log("Shortest path: ", data.path)

    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => cell.classList.remove("path"));

    data.path.forEach(([row, column]) => {
        const index = row*cols + column;
        const cell =  cells[index]

        if(!cell.classList.contains("start") && !cell.classList.contains("end")) {
            cell.classList.add("path");
        }
    });
})