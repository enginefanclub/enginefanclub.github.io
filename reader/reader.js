const READER_CONTAINER = document.getElementById("reader-container")
const READER_PAGE = document.getElementById("reader-page")
const TITLE = document.getElementById("webnovel-title")
const PAGINATION = document.getElementById("pagination")

let windowIndex = window.location.search
const urlParams = new URLSearchParams(windowIndex);
let id = urlParams.get("id")
let page = urlParams.get("p")-1
console.log(`trying to load ${id} on page ${page}`)

PAGINATION.innerHTML = ``

axios.get(`webnovels/${id}/${id}.json`).then(res => {

    let data = res.data

    TITLE.innerText = data.title

    axios.get(`webnovels/${id}/page/${page}.html`).then(res=>{

        TITLE.innerText = data.title
        READER_PAGE.innerHTML = res.data

        if (page >= 1) {
            PAGINATION.innerHTML += `<button onclick="getPage(${page})">last page</button>`
        }
        if (page+1 != data.pages) {
            PAGINATION.innerHTML += `<button onclick="getPage(${page+2})">next page</button>`
        }

    }).catch(err=>{

        READER_PAGE.innerHTML = `<h2>404 Page Not Found</h2>`

    })

}).catch(err=> {

    READER_CONTAINER.innerHTML = `<h2>404 Webnovel Not Found</h2>`

})

function getPage(newpage) {

    window.location.href = `?id=${id}&p=${newpage}`

}