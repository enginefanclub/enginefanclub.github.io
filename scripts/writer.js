const ARTICLE_PREVIEW = document.getElementById("article-preview")
const ARTICLE_BANNER = document.getElementById("article-banner")
const ARTICLE_TITLE = document.getElementById("article-title")
const ARTICLE_GAME = document.getElementById("article-game")
const ARTICLE_SUMMARY = document.getElementById("article-metadesc")
const ARTICLE_CONTENT = document.getElementById("article-content")
const ARTICLE_UPDATES = document.querySelectorAll(".update")

ARTICLE_UPDATES.forEach(input => {

    input.addEventListener('input', function (e) {

        updatePreview()

    })

})

function updatePreview() {

    ARTICLE_PREVIEW.innerHTML = `
    <img src="${ARTICLE_BANNER.value}" alt="" id="article-banner" class="article-banner">
            <div class="article-bg-wrap" id="article-bg-wrap">
                <div class="article-bg">

                    <h2 id="article-title">${ARTICLE_TITLE.value}</h2>

                    <h4 class="timestamp" id="article-timestamp">Posted Today</h4>
                    <div class="article-container" id="article-container">
                        ${ARTICLE_CONTENT.value}
                    </div>
                </div>
            </div>`

}

updatePreview()