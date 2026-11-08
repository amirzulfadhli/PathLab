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

runButton.addEventListener("click", () => {
    console.log("BFS button clicked");
})