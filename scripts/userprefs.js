let userprefs = {
    "gallery": false,
}

function toggleGalleryView() {

    userprefs.gallery = !userprefs.gallery

    saveprefs()

}

function saveprefs() {
    localStorage.setItem("efc-userprefs", JSON.stringify(userprefs))
    loadprefs()
}
function loadprefs() {
    let getuserprefs = localStorage.getItem("efc-userprefs", userprefs)

    if (getuserprefs != null) {
        userprefs = JSON.parse(getuserprefs)

        // article gallery view
        if (userprefs.gallery) {
            document.getElementById("article-list").classList.add("gallery")
            document.getElementById("gallery-toggle").innerHTML = `<i class="fa-solid fa-table-list"></i>`
        } else {
            document.getElementById("article-list").classList.remove("gallery")
            document.getElementById("gallery-toggle").innerHTML = `<i class="fa-solid fa-table-cells-large"></i>`
        }

    }

}

loadprefs()