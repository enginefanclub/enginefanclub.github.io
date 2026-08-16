// reinventing the wheel
const Mustache = require('mustache')
const moment = require('moment'); // NOTE: this does not account for timezones, its recommended only to use this for `fromNow`
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../');

const dist = path.join(root, 'dist');

fs.rmSync(dist, {recursive: true, force: true});
fs.mkdirSync(dist, { recursive: true });
fs.readdirSync('.').filter(x=>!['.git', '.gitignore', 'package.json', 'package-lock.json', 'dist', '.github'].includes(x)).forEach(file => {
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
    console.log(`[1/3] Built "${dist}/articles/${id}.html"`);
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
        <div class="screenshot-gallery" id="screenshot-gallery">${game.screenshots.map(screenshot => `<a href="${screenshot}" target="_blank"><img src="${screenshot}"></a>`).join("")}<div class="spacer"></div>` : "";

    let count = 0

    game.articleList = articles.map(article => {
        if (article.game == name) {
            return `
                <a href="../articles/${count}">
                    <div class="article-content">
                        <span class="article-title">${article.title}</span>
                        <span class="article-timestamp">${moment(article.timestamp).fromNow()}</span>
                    </div>
                </a>
            `
        }
        count++;
    })
    const content = Mustache.render(template, game);
    fs.writeFileSync(`${dist}/games/${name}.html`, content);
    console.log(`[2/3] Built "${dist}/games/${name}.html"`);
}

{
    const template = fs.readFileSync(path.join(root, 'games/index.html'), 'utf8');
    const content = Mustache.render(template, {
        gamesList: Object.keys(games).map(gameid => {
            const game = games[gameid];
            return `
            <a href="?g=${gameid}">
                <div class="article-content">
                    <span class="article-title">${game.title}</span>
                    <span data-timestamp="${game.release}" id="timestamp" class="article-timestamp"></span>
                </div>
            </a>`
        })
    });
    fs.writeFileSync(`${dist}/games/index.html`, content);
    console.log(`[3/3] Built "${dist}/games/index.html"`);
}
