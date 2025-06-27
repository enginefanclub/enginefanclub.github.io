const modal = document.getElementById("modal")

let news = {
    "title": "test",
    "timestamp": 1751052329949,
    "image": "https://cdn.pfps.gg/banners/7250-rainbow-cat.png",
    "metadesc": "",
    "content": "test"
}

function clipboard() {

    updateModal()

    const a = JSON.stringify(news)

    navigator.clipboard.writeText(a)

}

function updateModal() {

    news.metadesc = document.getElementById(`metadesc`).value
    news.image = document.getElementById(`banner`).value
    news.title = document.getElementById(`titleinput`).value
    news.content = document.getElementById(`descinput`).value

    news.timestamp = Date.now()

    modal.innerHTML = `
    <h2>${news.title}</h2>
            <span class="timestamp">just a few seconds ago</span><br>

            <span class="content">${news.content}</span>
    `

}

window.addEventListener('load', function () {

    document.getElementById(`metadesc`).addEventListener('input', function () {

        news.metadesc = document.getElementById(`metadesc`).value
        updateModal()

    })

    document.getElementById(`banner`).addEventListener('input', function () {

        news.image = document.getElementById(`banner`).value
        updateModal()

    })

    document.getElementById(`titleinput`).addEventListener('input', function () {

        news.title = document.getElementById(`titleinput`).value
        updateModal()

    })

    document.getElementById(`descinput`).addEventListener('input', function () {

        news.content = document.getElementById(`descinput`).value
        updateModal()

    })

    updateModal()

})


updateModal()