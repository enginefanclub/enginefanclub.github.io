const NEWS_GALLERY = document.getElementById("news-gallery")
const NEWS_OVERLAY = document.getElementById("news-overlay")

let NEWS_DATA

NEWS_GALLERY.innerHTML = ""
NEWS_OVERLAY.style.display = "none"

let index = 0
axios.get('jsons/news.json').then(res => {
    jsonData = res.data // should be json by default
    NEWS_DATA = jsonData
    jsonData.forEach(news => {
        if (index >= 6) {
            return
        }
        index += 1
        NEWS_GALLERY.innerHTML += `
            <div class="news-post" onclick="openNewsPost(${index - 1})">
                    <span class="news-timestamp">${moment(news.timestamp).fromNow()}</span>
                    <img src="${news.image}" alt="">
                    <span class="news-title" title="${news.title}">${news.title}</span>
                    <span class="news-shortdesc">${news.metadesc}</span>
                    <div class="news-game"><span>${news.game}</span></div>
                </div>
        `

    });

})

function openNewsPost(index) {

    NEWS_OVERLAY.style.display = ""

    let article = NEWS_DATA[index]

    NEWS_OVERLAY.innerHTML = `
    <div class="news-article" style="background:url(${article.image});">
    <div class="news-container">
    <button class="news-close" onclick="closeNews()">×</button>

            <img class="news-banner" src="${article.image}" alt="">
            
            <div class="news-inner">

                <span class="news-timestamp">Posted ${moment(article.timestamp).fromNow()}</span>
                <h2>${article.title}</h2>
                <div class="news-content">
                ${article.content}
                </div>

            </div>

        </div></div>`

}

function closeNews() {

    NEWS_OVERLAY.style.display = "none"

}