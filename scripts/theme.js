const d = new Date()

const getMonth = d.getMonth() + 1
const getDay = d.getDate()

const cssDict = {
    "1-4": "aprilfools",
    "6": "pride",
    "10": "halloween",
    "12": "christmas",
    "31-12": "newyear",
}

let getCSS = ""

function applyTheme(theme, type = null) {

    if (theme == null || theme == "default" && type == null) {
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
            console.log(`applied seasonal theme ${getCSS}`)
        } else {
            console.log(`${getDay}-${getMonth} no seasonal theme to apply`)
        }
    } else {

        let element = document.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('href', `/assets/themes/${theme}.css`);
        document.head.appendChild(element);
        console.log(`applied custom theme ${theme}`)

    }

}

try {
    applyTheme(JSON.parse(localStorage.getItem("efc-settings")).theme)
    applyTheme(JSON.parse(localStorage.getItem("efc-settings")).accessibility.font, "font")
} catch (error) {
    applyTheme(null)
}