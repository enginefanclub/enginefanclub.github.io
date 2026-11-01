const THEME_SELECT = document.getElementById("theme-select")

let def = { // default settings
    theme: "",
}

let user_settings

try {

    user_settings = JSON.parse(localStorage.getItem("efc-settings"))
    THEME_SELECT.value = user_settings.theme

    Object.keys(def).forEach(key=>{ // parity
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