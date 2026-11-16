const THEME_SELECT = document.getElementById("theme-select")
const FONT_SELECT = document.getElementById("font-select")
const FONT_SIZE_RANGE = document.getElementById("font-size-range")
const FONT_SIZE_DISPLAY = document.getElementById("font-size-display")

let def = { // default settings
    theme: "",
    accessibility: {
        font: "default",
        font_mod: 0,
    }
}

let user_settings

FONT_SIZE_DISPLAY.innerText = `${FONT_SIZE_RANGE.value}px`

try {

    user_settings = JSON.parse(localStorage.getItem("efc-settings"))
    THEME_SELECT.value = user_settings.theme
    FONT_SELECT.value = user_settings.accessibility.font
    FONT_SIZE_RANGE.value = user_settings.accessibility.font_mod

    Object.keys(def).forEach(key => { // parity
        console.log("HELP")
        if (!(key in user_settings)) {
            user_settings[key] = def[key]
        }
    })

    localStorage.setItem("efc-settings", JSON.stringify(user_settings))

} catch (e) {
    user_settings = def
    THEME_SELECT.value = "default"
    console.log(`could not load settings`)
    console.error(e)
}

THEME_SELECT.addEventListener("change", (e) => {
    user_settings.theme = THEME_SELECT.value
    localStorage.setItem("efc-settings", JSON.stringify(user_settings))
    location.reload()
})
FONT_SELECT.addEventListener("change", (e) => {
    user_settings.accessibility.font = FONT_SELECT.value
    localStorage.setItem("efc-settings", JSON.stringify(user_settings))
    location.reload()
})
FONT_SIZE_RANGE.addEventListener("change", (e)=>{
    FONT_SIZE_DISPLAY.innerText = `${FONT_SIZE_RANGE.value}px`
    user_settings.accessibility.font_mod = parseInt(FONT_SIZE_RANGE.value)
    localStorage.setItem("efc-settings", JSON.stringify(user_settings))
    location.reload()
})