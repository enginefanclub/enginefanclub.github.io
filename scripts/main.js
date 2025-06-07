const NEWS = document.getElementById("NEWSHOLD")
const OVERLAY = document.getElementById("NEWSOVERLAY")

let jsonData

NEWS.innerHTML = ``
OVERLAY.style.display = "none"

openPage("home")

function openPage(page) {

    document.getElementById("games").style.display = "none"
    document.getElementById("home").style.display = "none"

    document.getElementById(page).style.display = ""

}

function openNote(index) {

    let data = jsonData[index]

    OVERLAY.style.display = ""

    OVERLAY.innerHTML = `
    
    <div class="modal">

            <h3>${data.title}</h3>
            <span class="timestamp">posted ${moment(data.timestamp).fromNow()}</span><br>

            <span class="content">
                ${data.content}
            </span>

        </div>
        
        <button onclick="closeNote()">CLOSE</button>
    
    `

}

function closeNote() {

    OVERLAY.style.display = `none`

}

    jsonData = NEWS_ARR // should be json by default

    let index = 0

    jsonData.forEach(news => {
        
        NEWS.innerHTML += `<a class="Note" onclick="openNote(${index})">
                                <h2><b>${news.title}</b></h2>
                                <div class="timestamp">${moment(news.timestamp).fromNow()}</div>
                            </a>`

        index ++

    });
