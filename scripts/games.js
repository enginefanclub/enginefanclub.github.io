const GAMES_LIST = document.getElementById("games-list")

GAMES_LIST.innerHTML = ``

let games

let windowIndex = window.location.search
const urlParams = new URLSearchParams(windowIndex);
let gameid = urlParams.get("g")



axios.get("/assets/jsons/games.json").then(res => {

    games = res.data

    if (gameid != null) {

        const GAME_WRAPPER = document.getElementById("game-wrapper")
        const BG_WRAPPER = document.getElementById("bg-wrapper")

        let game = games[gameid]

        document.title = `${game.title} - Engine Fan Club`

        BG_WRAPPER.style.backgroundImage = `url('${game.bg}')`

        GAME_WRAPPER.innerHTML = `
        <div class="game-container" id="game-container">
                <img class="game-banner" src="${game.banner}" alt="">

                <div class="game-content">
                    <div class="left">
                        <h1>${game.title}</h1>
                        <p>
                            ${game.desc}
                        </p>
                        <div class="spacer"></div>
                        <h2 style="display: none;" id="screenshots-h2">screenshots</h2>
                        <div class="screenshot-gallery" id="screenshot-gallery">
                        </div>
                        <div class="spacer"></div>
                        <h2>recent activity</h2>
                        <div class="list games" id="article-list">

                        </div>
                    </div>
                    <div class="right">
                        <div class="info">
                            <button class="game-access" id="game-access">Access</button>
                            <hr id="access-hr">
                            <span class="subtitle">version</span>
                            <span>${game.version}</span>
                            <hr>
                            <span class="subtitle">release date</span>
                            <span>${moment(game.release).format("MMMM Do YYYY")}</span>
                            <hr>
                            <span class="subtitle">last updated</span>
                            <span>${game.lastupd}</span>
                            <hr>
                            <span class="subtitle">created</span>
                            <span>${game.created}</span>
                            <hr>
                            <span class="subtitle">tags</span>
                            <span class="game-tags" id="game-tags">
                            </span>
                            <hr>
                            <span class="subtitle">credits</span>
                            <ul id="game-credits">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `

        const ARTICLE_LIST = document.getElementById("article-list")
        const GAME_TAGS = document.getElementById("game-tags")
        const GAME_CREDITS = document.getElementById("game-credits")
        const SCREENSHOT_GALLERY = document.getElementById("screenshot-gallery")
        const GAME_ACCESS = document.getElementById("game-access")

        if (game.access.length <= 5) {
            GAME_ACCESS.style.display = "none"
            document.getElementById("access-hr").style.display = "none"
        } else {
            GAME_ACCESS.onclick = function() {
                window.open(game.access, "_blank")
            }
        }

        game.tags.forEach(tag => {
            GAME_TAGS.innerHTML += `<span>${tag}</span>`
        })
        game.credits.forEach(credit => {
            GAME_CREDITS.innerHTML += `<li>${credit}</li>`
        })
        if (game.screenshots && game.screenshots.length >= 1) {
            document.getElementById("screenshots-h2").style.display = ""
            game.screenshots.forEach(screenshot => {
                SCREENSHOT_GALLERY.innerHTML += `<a href="${screenshot}" target="_blank"><img src="${screenshot}"></a>`
            })
        }

        axios.get("/assets/jsons/news.json").then(res => {
            let news_data = res.data
            let count = 0

            news_data.forEach(article => {
                if (article.game == gameid) {
                    ARTICLE_LIST.innerHTML += `
                        <a href="../articles/?a=${count}">
                            <div class="article-content">
                                <span class="article-title">${article.title}</span>
                                <span class="article-timestamp">${moment(article.timestamp).fromNow()}</span>
                            </div>
                        </a>
                    `
                }
                count++
            })
        })

    } else {

        let keys = Object.keys(games)

        keys.forEach(gameid => {

            let game = games[gameid]

            GAMES_LIST.innerHTML += `
                <a href="?g=${gameid}">
                    <div class="article-content">
                        <span class="article-title">${game.title}</span>
                        <span class="article-timestamp">${moment(game.release).format("MMMM Do YYYY")}</span>
                    </div>
                </a>`

        });
    }

})