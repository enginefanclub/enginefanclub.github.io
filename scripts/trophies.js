const TROPHY_GRID = document.getElementById("trophy-grid")

const TROPHY_SIZE = 64
const ROWS = 6

TROPHY_GRID.innerHTML = ``

let row = 0
let col = 0
for (let i = 0; i < 6 * ROWS; i++) {

    let trophy = document.createElement("div")
    trophy.classList.add("trophy")
    trophy.style.width = `${TROPHY_SIZE}px`
    TROPHY_GRID.appendChild(trophy)

    trophy.style.backgroundPosition = `${ (col * -TROPHY_SIZE) }px ${row * -TROPHY_SIZE}px`

    col++
    if (col == 6) {
        col = 0
        row++
    }

}