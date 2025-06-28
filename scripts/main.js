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

    window.history.replaceState(null, null, `?i=${index}`);
    document.querySelector('meta[property="og:title"]').setAttribute("content", data.title);

}

function closeNote() {

    OVERLAY.style.display = `none`
    window.history.replaceState(null, '', window.location.pathname);
    document.querySelector('meta[property="og:title"]').setAttribute("content", "");

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let index = 0

axios.get('jsons/news.json').then(res => {
    jsonData = res.data // should be json by default

    jsonData.forEach(news => {

        NEWS.innerHTML += `<a class="Note" onclick="openNote(${index})" style="transform: rotate(${getRndInteger(-2, 1) + Math.random()}deg);">
                                <h2>${news.title}</h2>
                                <div class="timestamp">${moment(news.timestamp).fromNow()}</div>
                            </a>`

        index++

    });
})

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) } // https://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript

let params = new URLSearchParams(location.search);
let noteIndex = params.get('i')

if (isNumber(noteIndex)) {

    if (noteIndex >= 0 && noteIndex <= NEWS_ARR.length - 1) {

        openNote(noteIndex)

    }

}