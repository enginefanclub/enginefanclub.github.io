const READER_CONTAINER = document.getElementById("reader-container")
const READER_PAGE = document.getElementById("reader-page")
const TITLE = document.getElementById("webnovel-title")
const PAGINATION = document.getElementById("pagination")

let windowIndex = window.location.search
const urlParams = new URLSearchParams(windowIndex);
let id = urlParams.get("id")
let page = urlParams.get("p") - 1
console.log(`trying to load ${id} on page ${page}`)

let bookmark = {}

PAGINATION.innerHTML = ``

axios.get(`/reader/webnovels/${id}/${id}.json`).then(res => {

    let data = res.data

    TITLE.innerText = data.title

    axios.get(`/reader/webnovels/${id}/page/${page}.html`).then(res => {

        loadBookmark()

        TITLE.innerText = data.title
        READER_PAGE.innerHTML = res.data

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

    }).catch(err => {

        console.error(err)
        READER_PAGE.innerHTML = `<h2>404 Page Not Found</h2>`

    })

}).catch(err => {

    console.error(err)
    READER_CONTAINER.innerHTML = `<h2>404 Webnovel Not Found</h2>`

})

function getPage(newpage) {

    bookmark[id] = `${newpage}`
    saveBookmark()
    window.location.href = `?id=${id}&p=${newpage}`

}

function saveBookmark() {
    localStorage.setItem("efc-bookmark", JSON.stringify(bookmark))
}
function loadBookmark() {
    let getBookmark = localStorage.getItem("efc-bookmark")
    if (getBookmark != null) {
        bookmark = JSON.parse(getBookmark)
        if (page + 1 != bookmark[id]) {
            getPage(bookmark[id])
        }
    }
}