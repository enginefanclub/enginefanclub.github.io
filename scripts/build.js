// reinventing the wheel
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../');

const dist = path.join(root, 'dist');

fs.rmSync(dist, {recursive: true, force: true});
fs.mkdirSync(dist, { recursive: true });
fs.readdirSync('.').filter(x=>!['.git', '.gitignore', 'dist', '.github'].includes(x)).forEach(file => {
    fs.cpSync(path.join(root, file), path.join(dist, file), {
        recursive: true
    })
});
fs.rmSync(`${dist}/articles/template.html`);

// articles
const articles = require('./assets/jsons/news.json')

for (let i = 0; i < articles.length; i++) {
    const id = articles.length - i;
    const template = fs.readFileSync(path.join(root, 'articles/template.html'), 'utf8');
    const article = articles[i];
    const content = template
        .replaceAll("{{id}}", id)
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
