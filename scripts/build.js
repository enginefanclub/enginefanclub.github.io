const Mustache = require('mustache')
const moment = require('moment'); // NOTE: this does not account for timezones, its recommended only to use this for `fromNow`
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../');

const dist = path.join(root, 'dist');

const MAX_BUILT = 5;

fs.rmSync(dist, {recursive: true, force: true});
fs.mkdirSync(dist, { recursive: true });
fs.readdirSync('.').filter(x=>!['.git', '.gitignore', 'package.json', 'node_modules', 'package-lock.json', 'dist', '.github'].includes(x)).forEach(file => {
    fs.cpSync(path.join(root, file), path.join(dist, file), {
        recursive: true
    })
});
fs.rmSync(`${dist}/articles/template.html`);
fs.rmSync(`${dist}/games/index.html`);

// articles
const articles = require('../assets/jsons/news.json')

for (let i = 0; i < articles.length; i++) {
    const id = articles.length - i;
    const template = fs.readFileSync(path.join(root, 'articles/template.html'), 'utf8');
    const article = articles[i];
    article.id = id;
    article.imageStyle = (article.image == "/assets/missing.png") ? "display: none" : "";
    const content = Mustache.render(template, article);
    fs.writeFileSync(`${dist}/articles/${id}.html`, content);
    console.log(`[1/${MAX_BUILT}] Built "${dist}/articles/${id}.html"`);
}

// games

const games = require('../assets/jsons/games.json');

for (let i = 0; i < Object.keys(games).length; i++) {
    const template = fs.readFileSync(path.join(root, 'games/template.html'), 'utf8');
    const name = Object.keys(games)[i];
    const game = games[name];
    game.access = (game.access.length <= 5) ? "" : `
        <button class="game-access" id="game-access" onclick="window.open(\`${game.access}\`, '_blank')">Access</button><hr id="access-hr">
        <span class="subtitle">version</span>
        <span>${game.version}</span>
        <hr>
    `
    game.gameTags = game.tags.map(tag => `<span>${tag}</span>`).join("");
    game.gameCredits = game.credits.map(credit => `<li>${credit}</li>`).join("");
    game.screenshotsList = (game.screenshots && game.screenshots.length >= 1) ? `<h2 id="screenshots-h2">screenshots</h2>
        <div class="screenshot-gallery" id="screenshot-gallery">${game.screenshots.map(screenshot => `<a href="${screenshot}" target="_blank"><img src="${screenshot}"></a>`).join("")}</div><div class="spacer"></div>` : "";
    game.id = name;
    let count = 0

    game.articleList = articles.map(article => {
        if (article.game == name) {
            return `
                <a href="../articles/${articles.length-count}">
                    <div class="article-content">
                        <span class="article-title">${article.title}</span>
                        <span class="article-timestamp">${moment(article.timestamp).fromNow()}</span>
                    </div>
                </a>
            `
        }
        count++;
    }).join("\n")
    const content = Mustache.render(template, game);
    fs.writeFileSync(`${dist}/games/${name}.html`, content);
    console.log(`[2/${MAX_BUILT}] Built "${dist}/games/${name}.html"`);
}

{
    const template = fs.readFileSync(path.join(root, 'games/index.html'), 'utf8');
    const content = Mustache.render(template, {
        gamesList: Object.keys(games).map(gameid => {
            const game = games[gameid];
            return `
            <a href="${gameid}">
                <div class="article-content">
                    <span class="article-title">${game.title}</span>
                    <span data-timestamp="${game.release}" id="timestamp" class="article-timestamp"></span>
                </div>
            </a>`
        }).join("\n")
    });
    fs.writeFileSync(`${dist}/games/index.html`, content);
    console.log(`[3/${MAX_BUILT}] Built "${dist}/games/index.html"`);
}

const webnovels = require('../assets/jsons/webnovels.json');

{
    const index = fs.readFileSync(path.join(root, 'webnovels/index.html'), 'utf8');
    const contentIndex = Mustache.render(index, {
        list: Object.keys(webnovels).map(webnovel => {
            let wn = webnovels[webnovel];
            return `
                <a href="/webnovels/${webnovel}/1">
                    <div class="article-content">
                        <span class="article-title">${wn.title}</span>
                        <span data-timestamp="${wn.lastupd}" id="timestamp" class="article-timestamp"></span>
                    </div>
                </a>`
        }).join("\n")
    });
    fs.writeFileSync(`${dist}/webnovels/index.html`, contentIndex);
    console.log(`[4/${MAX_BUILT}] Built "${dist}/webnovels/index.html"`);
}

fs.readdirSync('./assets/webnovel').forEach(novel => {
    const webnovel = webnovels[novel];
    if (!webnovel) return;
    fs.mkdirSync(`${dist}/webnovels/${novel}`, { recursive: true });

    const redirect = fs.readFileSync(path.join(root, 'webnovels/redirect.html'), 'utf8');
    const template = fs.readFileSync(path.join(root, 'webnovels/template.html'), 'utf8');

    for (let page = 0; page < webnovel.pages; page++) {
        const pageContent = fs.readFileSync(path.join(root, `assets/webnovel/${novel}/pages/${page}.html`), 'utf8');
        if (!pageContent) continue;
        let PAGINATION = "";
        if (page >= 1) {
            PAGINATION += `<button onclick="getPage(\`${novel}\`, ${page})">previous page</button>`
        }
        let pageSelectContent = "";
        for (let i = 0; i < webnovel.pages; i++) {
            pageSelectContent += `<option value="${i + 1}"${(i == page) ? " selected" : ""}>${i + 1}</option>`
        }
        PAGINATION += `<select id="page-select" onchange="getPage(\`${novel}\`, this.value)">${pageSelectContent}</select>`
        if (page + 1 != webnovel.pages) {
            PAGINATION += `<button onclick="getPage(\`${novel}\`, ${page + 2})">next page</button>`
        }
        const content = Mustache.render(template, {
            ...webnovel,
            data: pageContent,
            PAGINATION,
            page,
            id: novel
        });
        fs.writeFileSync(`${dist}/webnovels/${novel}/${page + 1}.html`, content);
        console.log(`[5/${MAX_BUILT}] [${page + 1}/${webnovel.pages + 1}] Built "${dist}/webnovels/${novel}/${page + 1}.html"`);
    }
    fs.writeFileSync(`${dist}/webnovels/${novel}/index.html`, redirect);
    console.log(`[5/${MAX_BUILT}] [${webnovel.pages + 1}/${webnovel.pages + 1}] Built "${dist}/webnovels/${novel}/index.html"`);
})
