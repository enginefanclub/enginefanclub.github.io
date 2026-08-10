const ARTICLE_PREVIEW = document.getElementById("preview")
const ARTICLE_BANNER = document.getElementById("article-banner")
const ARTICLE_TITLE = document.getElementById("article-title")
const ARTICLE_GAME = document.getElementById("game-id")
const ARTICLE_DESC = document.getElementById("article-desc")
const ARTICLE_CONTENT = document.getElementById("article-content")

const ARTICLE_UPDATES = document.querySelectorAll(".update")

ARTICLE_UPDATES.forEach(input => {

    input.addEventListener('input', function (e) {

        updatePreview()

    })

})

function updatePreview() {
    ARTICLE_PREVIEW.innerHTML = `
    <div class="news-article" style="background:url(${ARTICLE_BANNER.value});">
            <div class="news-container">

                <img class="news-banner" src="${ARTICLE_BANNER.value}" alt="">

                <div class="news-inner">

                    <span class="news-timestamp">Posted Today</span>
                    <h2>${ARTICLE_TITLE.value}</h2>
                    <div class="news-content">
                        ${ARTICLE_CONTENT.value}
                    </div>

                </div>

            </div>
        </div>`
}