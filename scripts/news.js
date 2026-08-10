const ARTICLE_LIST = document.getElementById("article-list")

ARTICLE_LIST.innerHTML = ``

let windowIndex = window.location.search
const urlParams = new URLSearchParams(windowIndex);
let articleid = urlParams.get("a")

if (articleid != null) {

    axios.get("../jsons/news.json").then(res => {

        const ARTICLE_TITLE = document.getElementById("article-title")
        const ARTICLE_CONTAINER = document.getElementById("article-container")
        const ARTICLE_TIMESTAMP = document.getElementById("article-timestamp")
        const ARTICLE_BANNER = document.getElementById("article-banner")
        const ARTICLE_BG = document.getElementById("article-bg-wrap")

        document.getElementById("gallery-toggle").remove()

        let articles = res.data

        if (articles[Math.abs(articleid-articles.length)] && articleid <= articles.length) {
            let article = articles[Math.abs(articleid-articles.length)]

            document.title = `${article.title} - Engine Fan Club`

            ARTICLE_TITLE.innerHTML = article.title
            ARTICLE_TITLE.style.marginBottom = "0px"
            ARTICLE_CONTAINER.innerHTML = article.content
            ARTICLE_TIMESTAMP.innerHTML = `posted ${moment(article.timestamp).format("MMMM Do YYYY")}`
            ARTICLE_BANNER.style.display = ""
            ARTICLE_BANNER.src = article.image
            if (article.image == "../assets/banners/missing.png") {
                ARTICLE_BANNER.style.display = "none"
            }
            //ARTICLE_BG.style.backgroundImage = `url(${article.image  })`
        } else {
            ARTICLE_TITLE.innerText = `404 Article Not Found`
        }

    })

}

function loadarticles(num, src) {

    if (articleid != null) return;

    let articles

    axios.get("../jsons/news.json").then(res => {

        articles = res.data

        let count = 0

        articles.forEach(article => {

            let getArticleNum = articles.length - count

            if (count <= num - 1) {
                ARTICLE_LIST.innerHTML += `
                <a href="${src}?a=${getArticleNum}">
                    <img src="${article.image}">
                    <div class="article-content">
                        <span class="article-metadesc">${article.metadesc}</span>
                        <span class="article-title">${article.title}</span>
                        <span class="article-timestamp">${moment(article.timestamp).fromNow()}</span>
                    </div>
                </a>`
            }

            count++

        });

        if (num < articles.length) {
            ARTICLE_LIST.innerHTML += `
                <a href="articles/">
                    <span class="article-title">see more...(${articles.length - 6} omitted)</span>
                </a>`
        }

    })

}