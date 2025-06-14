const NEWS = document.getElementById("NEWSHOLD")
const OVERLAY = document.getElementById("NEWSOVERLAY")

let jsonData

NEWS.innerHTML = ``
OVERLAY.style.display = "none"

openPage("home")

function openPage(page) {

    document.getElementById("games").style.display = "none"
    document.getElementById("home").style.display = "none"
    document.getElementById("aboutus").style.display = "none"

    document.getElementById(page).style.display = ""

}

function openNote(index) {

    let data = jsonData[index]

    OVERLAY.style.display = ""

    OVERLAY.innerHTML = `
    
    <div class="modal">

            <h2>${data.title}</h2>
            <span class="timestamp">posted ${moment(data.timestamp).fromNow()}</span><br>

            <span class="content">
                ${data.content}
            </span>

        </div>
        
        <button class="CLOSEBTN" onclick="closeNote()">CLOSE</button>
    
    `

}

function closeNote() {

    OVERLAY.style.display = `none`

}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
jsonData = NEWS_ARR // should be json by default

let index = 0

jsonData.forEach(news => {

    NEWS.innerHTML += `<a class="Note" onclick="openNote(${index})" style="transform: rotate(${getRndInteger(-2, 1) + Math.random()}deg);">
                                <h2><b>${news.title}</b></h2>
                                <div class="timestamp">${moment(news.timestamp).fromNow()}</div>
                            </a>`

    index++

});
