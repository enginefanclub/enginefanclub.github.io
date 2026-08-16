// reinventing the wheel
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');

fs.rmSync(dist, {recursive: true, force: true});
fs.cpSync(__dirname, dist, {
    recursive: true,
})
['articles/template.html', 'build.js'].forEach(file => {
    fs.rmSync(`${dist}/${file}`);
})

// articles
const articles = require('./assets/jsons/news.json')

for (let i = 0; i < articles.length; i++) {
    const id = articles.length - i;
    const template = fs.readFileSync('./templates/article.html', 'utf8');
    const article = articles[i];
    const content = template
        .replaceAll("{{title}}", article.title)
        .replaceAll("{{titleStyle}}", article.title)
        .replaceAll("{{metadesc}}", article.metadesc)
        .replaceAll("{{image}}", article.image)
        .replaceAll("{{content}}", article.content)
        .replaceAll("{{timestamp}}", article.timestamp)
        .replaceAll("{{imageStyle}}", (article.image == "/assets/missing.png") ? "display: none" : "")

    // NOTE: This will be a problem if we reach the id 404, pls keep this in mind
    // TODO: change it so it uses directories to allow a 404.html
    fs.writeFileSync(`${dist}/articles/${id}.html`, content);
    console.log(`Built ${dist}/articles/${id}.html!`);
}
