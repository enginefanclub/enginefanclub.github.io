//const READER_CONTAINER = document.getElementById("reader-container")
//const READER_PAGE = document.getElementById("reader-page")
//const TITLE = document.getElementById("webnovel-title")
const PAGINATION = document.getElementById("pagination")
const WEBNOVELS_WRAP = document.getElementById("webnovels-wrap")
const WEBNOVELS_LIST = document.getElementById("webnovels-list")

let windowIndex = window.location.search
const urlParams = new URLSearchParams(windowIndex);
/*let id = urlParams.get("wn")
let page = urlParams.get("p") - 1

console.log(`trying to load ${id} on page ${page}`)*/

let bookmark = {}

/*PAGINATION.innerHTML = ``

axios.get(`/assets/jsons/webnovels.json`).then(res => {

    let json = res.data
    let data = json[id]

    Object.keys(json).forEach(webnovel => {
        let wn = json[webnovel]

        WEBNOVELS_LIST.innerHTML += `
                <a href="?wn=${webnovel}&p=1">
                    <div class="article-content">
                        <span class="article-title">${wn.title}</span>
                        <span class="article-timestamp">${moment(wn.lastupd).format("MMMM Do YYYY")}</span>
                    </div>
                </a>`
    })

    axios.get(`/assets/webnovel/${id}/pages/${page}.html`).then(res => {

        TITLE.innerText = data.title

        TITLE.innerText = data.title
        TITLE.innerHTML += `            <div class="flex-right reader-buttons">
                <button onclick="saveBookmark()">save</button>
                <button onclick="loadBookmark()">load</button>
            </div>`
        READER_PAGE.innerHTML = res.data
        READER_CONTAINER.style.display = ""

        if (page >= 1) {
            PAGINATION.innerHTML += `<button onclick="getPage(${page})">previous page</button>`
        }
        PAGINATION.innerHTML += `<select id="page-select"></select>`
        if (page + 1 != data.pages) {
            PAGINATION.innerHTML += `<button onclick="getPage(${page + 2})">next page</button>`
        }

        const PAGE_SELECT = document.getElementById("page-select")
        for (let i = 0; i < data.pages; i++) {
            PAGE_SELECT.innerHTML += `<option value="${i + 1}">${i + 1}</option>`
        }
        PAGE_SELECT.value = page + 1

        PAGE_SELECT.onchange = (event) => {
            getPage(PAGE_SELECT.value)
        }

        WEBNOVELS_WRAP.style.display = "none"

    }).catch(err => {

        console.error(err)

    })

}).catch(err => {

    console.error(err)

})*/

function getPage(id, newpage) {
    const url = new URL(window.location.href);
    const parts = url.pathname.split('/');
    parts[parts.length - 1] = newpage;
    url.pathname = parts.join("/");
    bookmark[id] = `${newpage}`
    window.location.href = url.toString();
}

function saveBookmark(id, page) {
    bookmark[id] = page + 1
    localStorage.setItem("efc-bookmark", JSON.stringify(bookmark))
}
function loadBookmark(id, page) {
    let getBookmark = localStorage.getItem("efc-bookmark")
    if (getBookmark != null) {
        bookmark = JSON.parse(getBookmark)
        if (page + 1 != bookmark[id]) {
            getPage(id, bookmark[id])
        }
    }
}
