const d = new Date()

const getMonth = d.getMonth() + 1
const getDay = d.getDate()

const cssDict = {
    "10": "halloween",
    "12": "christmas",
}

let getCSS = ""

if (getMonth in cssDict) {
    getCSS = cssDict[getMonth]
}
if (`${getDay}-${getMonth}` in cssDict) {
    getCSS = cssDict[`${getDay}-${getMonth}`]
}

if (getCSS != "") {
    let element = document.createElement('link');
    element.setAttribute('rel', 'stylesheet');
    element.setAttribute('href', `/assets/themes/${getCSS}.css`);
    document.head.appendChild(element);
    console.log(`applying seasonal theme ${getCSS}`)
} else {
    console.log(`no seasonal theme to apply`)
}

