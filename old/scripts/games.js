const GAME_CONTAINER = document.getElementById("game-container")
let GAMES_DATA
let NEWS_DATA

document.getElementById("selected-game").innerText = ""
GAME_CONTAINER.innerHTML = ``

axios.get('jsons/news.json').then(res => {
    NEWS_DATA = res.data

    axios.get('jsons/games.json').then(res => {
        jsonData = res.data // should be json by default
        GAMES_DATA = jsonData
        let windowIndex = window.location.search
        const urlParams = new URLSearchParams(windowIndex);
        if (urlParams.get("id").length >= 0) {
            id = urlParams.get("id")
            loadGame(id)
        }
    })

})


function loadGame(id) {
    if (id in GAMES_DATA) {

        let game = GAMES_DATA[id]

        console.log("game exists time to load")

        GAME_CONTAINER.innerHTML = `
        <img class="game-banner" src="${game.banner}" alt="">

                <div class="game-content">
                    <div class="left">
                        <h1>${game.title}</h1>
                        <p>
                            ${game.desc}
                        </p>
                        <h2>recent activity</h2>
                        <div class="news-list" id="game-news-list">
                            <div class="news-list-line">
                                <h3>Dec 25, 2026</h3>
                                <hr>
                            </div>
                            <div class="news-list-item">
                                <img src="../assets/banners/mustardisshin.png" alt="">
                                <div class="news-list-content">
                                    <h3>SMALLER WEBSITE UPDATE - UPDATING THE MUSTARD SKILL CREATOR</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="info">
                            <button class="play-button" id="access-button">PLAY</button>
                            <span class="subtitle">version</span>
                            <span>${game.version}</span>
                            <hr>
                            <span class="subtitle">release date</span>
                            <span$>${game.release}</span>
                            <hr>
                            <span class="subtitle">last updated</span><br>
                            <span>${game.lastupd}</span>
                            <hr>
                            <span class="subtitle">created</span><br>
                            <span>${game.created}</span>
                            <hr>
                            <span class="subtitle">tags</span>
                            <span class="game-tags" id="game-tags">
                                <span>RPG</span>
                                <span>Turn-Based</span>
                                <span>Retro-styled</span>
                            </span>
                            <hr>
                            <span class="subtitle">credits</span>
                            <ul id="game-credits">
                                <li><b>nefarkitti</b> - lead developer & story</li>
                                <li><b>1nning</b> - balancing, advisor, pt-BR translation</li>
                                <li><b>faketitan</b> - assets & advisor</li>
                                <li><b>lake</b> - music, FI translation</li>
                            </ul>
                        </div>
                    </div>
                </div>
        `

        GAME_CONTAINER.style.background = `url("${game.banner}")`

        document.getElementById("selected-game").innerText = game.title
        document.title = `${game.title} - Engine Fan Club`

        const GAME_TAGS = document.getElementById("game-tags")
        const GAME_CREDITS = document.getElementById("game-credits")
        const GAME_NEWS_LIST = document.getElementById("game-news-list")
        const GAME_ACCESS = document.getElementById("access-button")

        if (game.access.length <= 10) {
            GAME_ACCESS.style.display = "none"
        } else {
            GAME_ACCESS.onclick = function () {
                window.open(game.access)
            }
        }

        GAME_TAGS.innerHTML = ``
        GAME_CREDITS.innerHTML = ``
        GAME_NEWS_LIST.innerHTML = ``

        game.tags.forEach(tag => {
            GAME_TAGS.innerHTML += `<span>${tag}</span>`
        });
        game.credits.forEach(tag => {
            GAME_CREDITS.innerHTML += `<li>${tag}</li>`
        });

        var lastDate = ""
        NEWS_DATA.forEach(article => {

            if (article.game == id) {

                var timestamp = moment(article.timestamp).format("MMM Do YYYY")
                if (lastDate != timestamp) {
                    lastDate = timestamp
                    GAME_NEWS_LIST.innerHTML += `
                 <div class="news-list-line">
                                <h3>${timestamp}</h3>
                                <hr>
                            </div>`
                }

                GAME_NEWS_LIST.innerHTML += `
            <div class="news-list-item">
                                <img src="${article.image}" alt="">
                                <div class="news-list-content">
                                    <h3>${article.title}</h3>
                                    <p>${article.metadesc}</p>
                                </div>
                            </div>`

            }

        })

    }

}