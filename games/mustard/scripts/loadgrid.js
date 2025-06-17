const grid = document.getElementById("castgrid")
const overlay = document.getElementById("NEWSOVERLAY")

grid.innerHTML = ``
overlay.style.display = "none"

function openCharacter(id) {

    let member = CAST[id]

    overlay.style.display = ""
    overlay.innerHTML = `
    <div class="modal">

            <div class="profile">
                
                <h1>${member.name}</h1>
                <img src="https://media.tenor.com/TVPRpC5hKhMAAAAM/stare-cat.gif    " alt="">

            </div>

            <div class="desc">
                ${member.desc}
            </div>
            
        </div>
        
        <button onclick="closeCharacter()">CLOSE</button>
    `
}
function closeCharacter() {
    overlay.style.display = "none"
}

let count = 0

CAST.forEach(member => {

    if (member.name != "template") {

        grid.innerHTML += `
                        <div class="castmember" onclick="openCharacter(${count})">

                            <img src="https://media.tenor.com/TVPRpC5hKhMAAAAM/stare-cat.gif" alt="">

                            <span>${member.name}</span>

                        </div>
    `

    }

    count++

})

//openCharacter(3)