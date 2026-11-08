let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}
let critterJSON

let userData = null;
// {"user_id":2,"username":"Firee","joined":1792454072443,"lastOnline":1792454072443,"icon":"user","badges":"[]","badgeColor":"#000000","trophies":"[]","critters":"['cat']","critter_selected":"cat"}

function getel(id) {
    return document.getElementById(id)
}
function getqueryall(id) {
    return document.querySelectorAll(id);
}

function sethide(id, hide) {
    getel(id).hidden = hide
}

function getSpritePosition(posx, posy, sizing) {
    return [posx * -sizing, posy * -sizing]
}
async function init() {
    if (localStorage.getItem("efc-usertoken") != null || window.location.hash.length > 1) {

        const iconsResponse = await axios.get("/assets/jsons/profile/icons.json?v=2")
        const badgesResponse = await axios.get("/assets/jsons/profile/badges.json?v=2")
        const crittersResponse = await axios.get("/assets/jsons/critters.json?v=2")
        const trophiesResponse = await axios.get("/assets/jsons/profile/trophies.json?v=2")
        const userName = window.location.hash.replace("#", "");

        let organisedIcons = {}
        let organisedCritters = {}

        Object.keys(iconsResponse.data).forEach(iconkey => {
            let icon = iconsResponse.data[iconkey]
            if (!(icon.category in organisedIcons)) {
                icon.id = iconkey
                organisedIcons[icon.category] = [icon]
            } else {
                icon.id = iconkey
                organisedIcons[icon.category].push(icon)
            }
        })
        console.log(`sorted icons:`, organisedIcons)

        Object.keys(crittersResponse.data).forEach(critterkey => {
            let critter = crittersResponse.data[critterkey]
            if (!(critter.category in organisedCritters)) {
                critter.id = critterkey
                organisedCritters[critter.category] = [critter]
            } else {
                critter.id = critterkey
                organisedCritters[critter.category].push(critter)
            }
        })
        console.log(`sorted critters:`, organisedCritters)

        let checkingOtherUser = false;
        if (userName.length > 0 && userName != "login" && userName != "register") {
            checkingOtherUser = true;
        }
        axios({
            url: (checkingOtherUser) ? `${apiURL}/users/${userName}` : `${apiURL}/myself`,
            method: "GET",
            headers: {
                "authorization": localStorage.getItem("efc-usertoken")
            },
            timeout: 5000
        }).then(res => {
            userData = res.data;
            try {
                if (!checkingOtherUser) {
                    userData.critters = JSON.parse(userData.critters)
                    userData.trophies = JSON.parse(userData.trophies)
                    userData.exclusive_icons = JSON.parse(userData.exclusive_icons);
                }
                userData.badges = JSON.parse(userData.badges)
            } catch (e) {
                console.error(e);
                userData.critters = [];
                userData.badges = [];
                userData.trophies = [];
                userData.exclusive_icons = [];
            }
            if (checkingOtherUser) {
                getel('setting-divider').hidden = true
                getel("profile-settings").hidden = true;
            }

            document.title = userData.username + " - Engine Fan Club"
            getel("username").innerText = userData.username;
            getel("joined").innerText = moment(userData.joined).format("DD/MM/YYYY");
            getel("lastOnline").innerText = moment(userData.lastOnline).fromNow();
            getel('profile-banner').style.backgroundColor = userData.badgeColor;
            if (userData.candies >= 1) {
                getel("show-currency").style.display = ""

                getel("currency-container").innerHTML += `<div><img src="/assets/site/seasonal/candy_red.png" alt="">${userData.candies}</div>`
            }

            //TROPHY SETUP
            let trophiesJSON = trophiesResponse.data
            let hasTrophies = 0
            if (!checkingOtherUser) {
                getel('trophy-container').style.display = ""
                Object.keys(trophiesJSON).forEach(trophy => {
                    let getTrophy = trophiesJSON[trophy]
                    let getTrophyPos = getSpritePosition(getTrophy.pos[0], getTrophy.pos[1], 32)
                    let trophyDiv = document.createElement("div")
                    trophyDiv.classList.add("trophy")
                    trophyDiv.style.backgroundPosition = `${getTrophyPos[0]}px ${getTrophyPos[1]}px`
                    if (!userData.trophies.includes(trophy)) trophyDiv.style.filter = "contrast(50%)";
                    if (userData.trophies.includes(trophy)) hasTrophies++;
                    trophyDiv.setAttribute("data-after", getTrophy.name)
                    trophyDiv.setAttribute("data-before", getTrophy.hint)
                    getel('trophy-grid').appendChild(trophyDiv)
                })
                getel('trophy-container').innerHTML += `<span class="extra">only obtained trophies will be displayed for others to see</span>`
            } else {
                if (userData.trophies.length >= 1) {
                    getel('trophy-container').style.display = ""
                    Object.keys(trophiesJSON).forEach(trophy => {
                        if (userData.trophies.includes(trophy)) {
                            hasTrophies++
                            let getTrophy = trophiesJSON[trophy]
                            let getTrophyPos = getSpritePosition(getTrophy.pos[0], getTrophy.pos[1], 32)
                            let trophyDiv = document.createElement("div")
                            trophyDiv.classList.add("trophy")
                            trophyDiv.style.backgroundPosition = `${getTrophyPos[0]}px ${getTrophyPos[1]}px`
                            trophyDiv.setAttribute("data-after", getTrophy.name)
                            trophyDiv.setAttribute("data-before", getTrophy.hint)
                            getel('trophy-grid').appendChild(trophyDiv)
                        }
                    })
                }
            }
            getel('trophy-count').innerText = `trophies (${hasTrophies}/${Object.keys(trophiesJSON).length})`
            //TROPHY SETUP

            //BADGES SETUP
            if (userData.badges.length >= 1) {
                let badgeList = document.createElement("div")
                badgeList.classList.add("badges")
                userData.badges.forEach(badge => {
                    let badgeData = badgesResponse.data[badge]
                    let badgeEl = document.createElement("div")
                    badgeEl.classList.add("badge")
                    let getBadgePos = getSpritePosition(badgeData.pos[0], badgeData.pos[1], 32)
                    badgeEl.style.backgroundPosition = `${getBadgePos[0]}px ${getBadgePos[1]}px`
                    badgeEl.title = badgeData.name
                    badgeList.appendChild(badgeEl)
                })
                getel("username").appendChild(badgeList)
            }
            //BADGES SETUP

            //ICON SETUP
            const dataIcon = iconsResponse.data[userData.icon];
            if (dataIcon) {
                getel('profile-icon').style.backgroundImage = `url('/assets/profile/icons/${dataIcon.category}/${userData.icon}.png')`
            }
            //ICON SETUP

            if (checkingOtherUser) {
                sethide("window-profile", false)
                sethide("window-load", true)
                sethide("window-account-settings", true)
                return console.log("doesnt need any more")
            }

            let registeredTabs = []
            const TAB_BTNS = document.querySelectorAll(".tabbtn")
            TAB_BTNS.forEach(btn => {
                registeredTabs.push(btn.getAttribute('data-target-tab'))
            })

            TAB_BTNS.forEach(btn => {
                btn.onclick = function () {
                    registeredTabs.forEach(tab => {
                        getel(`${tab}-btn`).classList.remove("sel")
                        getel(tab).style.display = "none"
                    })
                    getel(btn.getAttribute("data-target-tab")).style.display = ""
                    btn.classList.add("sel")
                }
            })

            //INVENTORY ICONS
            const ICONS_TAB = getel("icons-tab")
            const ICON_CATEGORIES = getel("icon-categories")

            let getIconCategories = Object.keys(organisedIcons)
            let getOwnedIconCategories = []
            getIconCategories.forEach(category => {
                let getIconCategoryOwnedCount = 0
                organisedIcons[category].forEach(icon => {
                    if (userData.exclusive_icons.includes(icon.id) || icon.default == true) {
                        getIconCategoryOwnedCount++
                    }
                })
                if (getIconCategoryOwnedCount >= 1) {
                    getOwnedIconCategories.push(category)
                }
            })

            let checkedicon
            getOwnedIconCategories.forEach(category => {

                let getCategory = organisedIcons[category]

                let categoryButton = document.createElement("button")
                categoryButton.innerText = category
                categoryButton.id = `tab-icons-${category}`
                if (category == "default") categoryButton.classList.add("sel")
                ICON_CATEGORIES.appendChild(categoryButton)

                categoryButton.onclick = function () {
                    getOwnedIconCategories.forEach(cat => {
                        getel(`tab-icons-${cat}`).classList.remove("sel")
                        getel(`icons-grid-${cat}`).style.display = "none"
                        getel(`tab-icons-${category}`).classList.add("sel")
                        getel(`icons-grid-${category}`).style.display = ""
                    })
                }

                let grid = document.createElement("div")
                grid.classList.add("profile-grid")
                grid.id = `icons-grid-${category}`
                grid.style.display = "none"
                if (category == "default") grid.style.display = "";

                getCategory.forEach(icon => {
                    if (!userData.exclusive_icons.includes(icon.id) && icon.default == false) return;
                    let iconButton = document.createElement("button")
                    iconButton.classList.add("icon")
                    iconButton.id = icon.id
                    iconButton.style.background = `url('/assets/profile/icons/${icon.category}/${icon.id}.png')`
                    grid.appendChild(iconButton)

                    if (userData.icon == icon.id) {
                        iconButton.classList.add("check");
                        checkedicon = iconButton
                    }

                    iconButton.onclick = async function () {
                        //if (iconName == userData.icon) return;
                        axios({
                            url: `${apiURL}/settings/icon`,
                            method: "POST",
                            headers: {
                                "authorization": localStorage.getItem("efc-usertoken")
                            },
                            data: {
                                icon: icon.id
                            },
                            timeout: 5000
                        }).then(res => {
                            checkedicon.classList.remove("check")
                            iconButton.classList.add("check")
                            checkedicon = iconButton
                            getel('profile-icon').style.background = `url('/assets/profile/icons/${category}/${icon.id}.png')`
                        }).catch(e => {
                            console.error(e);
                            if (e.response && e.response.data) {
                                alert(e.response.data);
                            } else if (e.response) {
                                alert(e.response);
                            }
                        })
                    }
                })
                ICONS_TAB.appendChild(grid)
            })
            //INVENTORY ICONS

            //INVENTORY CRITTERS
            const CRITTERS_TAB = getel("critters-tab")
            const CRITTER_CATEGORIES = getel("critter-categories")

            const CRITTER_PREVIEW = document.createElement("div")
            CRITTER_PREVIEW.classList.add("critter-preview")
            CRITTER_PREVIEW.id = "critter-preview"

            const CRITTER_INFO = document.createElement("div")
            CRITTER_INFO.id = "critter-info"
            CRITTER_PREVIEW.appendChild(CRITTER_INFO)

            let getCritterCategories = Object.keys(organisedCritters)
            let getOwnedCritterCategories = []
            getCritterCategories.forEach(category => {
                let getCategoryOwnedCount = 0
                organisedCritters[category].forEach(critter => {
                    if (userData.critters.includes(critter.id) || critter.default == true) { // defaulting later when backend is open
                        getCategoryOwnedCount++
                    }
                })
                if (getCategoryOwnedCount >= 1) {
                    getOwnedCritterCategories.push(category)
                }
            })
            console.log(getOwnedCritterCategories)

            let checkedcritter
            getOwnedCritterCategories.forEach(category => {

                let getCategory = organisedCritters[category]

                let categoryButton = document.createElement("button")
                categoryButton.innerText = category
                categoryButton.id = `tab-critters-${category}`
                if (category == "default") categoryButton.classList.add("sel")
                CRITTER_CATEGORIES.appendChild(categoryButton)

                categoryButton.onclick = function () {
                    getOwnedCritterCategories.forEach(cat => {
                        getel(`tab-critters-${cat}`).classList.remove("sel")
                        getel(`critters-grid-${cat}`).style.display = "none"
                        getel(`tab-critters-${category}`).classList.add("sel")
                        getel(`critters-grid-${category}`).style.display = ""
                    })
                }

                let grid = document.createElement("div")
                grid.classList.add("profile-grid")
                grid.id = `critters-grid-${category}`
                grid.style.display = "none"
                if (category == "default") grid.style.display = "";

                getCategory.forEach(critter => {
                    if (!userData.critters.includes(critter.id)) return;
                    let critterButton = document.createElement("button")
                    critterButton.classList.add("icon")
                    critterButton.id = critter.id
                    critterButton.style.backgroundImage = `url('/assets/sprites/critters/${critter.id}.png')`
                    grid.appendChild(critterButton)

                    if (userData.critter_selected == critter.id) {
                        critterButton.classList.add("check");
                        checkedcritter = critterButton
                        CRITTER_PREVIEW.style.backgroundImage = `url('/assets/sprites/critters/${critter.id}.png')`
                        CRITTER_INFO.innerText = critter.name
                    }

                    critterButton.onclick = function () {
                        if (socket != null) {
                            socket.emit('changesprite', critter.id);
                            localStorage.setItem("efc-critter", critter.id);

                            checkedcritter.classList.remove("check")
                            critterButton.classList.add("check")
                            checkedicon = critterButton
                            CRITTER_PREVIEW.style.backgroundImage = `url('/assets/sprites/critters/${critter.id}.png')`
                            CRITTER_INFO.innerText = critter.name
                        }
                    }
                })
                CRITTERS_TAB.appendChild(grid)
            })

            CRITTERS_TAB.appendChild(CRITTER_PREVIEW)
            //INVENTORY CRITTERS

            //INVENTORY BANNERS
            const BANNERS_TAB = document.getElementById("banners-tab")

            const bannerColours = [
                "#000000",
                "#0000A8",
                "#00A800",
                "#00A8A8",
                "#A80000",
                "#A800A8",
                "#A85400",
                "#A8A8A8",
                "#545454",
                "#5454FC",
                "#54FC54",
                "#54FCFC",
                "#FC5454",
                "#FC54FC",
                "#FCFC54",
                "#FCFCFC"
            ]
            let checkedbanner
            let grid = document.createElement("div")
            grid.classList.add("profile-grid")
            grid.id = `banners-grid-default`

            BANNERS_TAB.appendChild(grid)
            bannerColours.forEach(colour => {
                let bannerButton = document.createElement("button")
                bannerButton.classList.add("icon")
                bannerButton.id = colour.replace("#", "");
                bannerButton.style.background = colour
                grid.appendChild(bannerButton)

                if (userData.badgeColor == colour) {
                    bannerButton.classList.add("check");
                    checkedbanner = bannerButton
                }

                bannerButton.onclick = function () {
                    axios({
                        url: `${apiURL}/settings/colour`,
                        method: "POST",
                        headers: {
                            "authorization": localStorage.getItem("efc-usertoken")
                        },
                        data: {
                            colour: colour
                        },
                        timeout: 5000
                    }).then(res => {
                        checkedbanner.classList.remove("check")
                        bannerButton.classList.add("check")
                        checkedbanner = bannerButton
                        getel('profile-banner').style.backgroundColor = colour;
                    }).catch(e => {
                        console.error(e);
                        if (e.response && e.response.data) {
                            alert(e.response.data);
                        } else if (e.response) {
                            alert(e.response);
                        }
                    })
                }
            })
            //INVENTORY BANNERS

            sethide("window-profile", false)
            sethide("window-load", true)

        })

    } else {
        sethide("window-auth", false);
        sethide("window-load", true);
    }
}

getel("register").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(getel("register")));
    if (data.password != data.confirmpassword) {
        getel("register-status").innerText = "Both passwords do not match!";
        return;
    }
    try {
        const verifyAuth = await axios.post(`${apiURL}/register`, data);
        if (verifyAuth) {
            localStorage.setItem('efc-usertoken', verifyAuth.data.token);
            history.pushState("", document.title, window.location.pathname);
            location.reload();
        }
    } catch (e) {
        console.error(e);
        if (e.response && e.response.data) {
            getel("register-status").innerText = e.response.data;
        } else if (e.response) {
            getel("register-status").innerText = e.response;
        }
    }
})
getel("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(getel("login")));
    try {
        const verifyAuth = await axios.post(`${apiURL}/auth`, data);
        if (verifyAuth) {
            localStorage.setItem('efc-usertoken', verifyAuth.data.token);
            history.pushState("", document.title, window.location.pathname);
            location.reload();
        }
    } catch (e) {
        console.error(e);
        if (e.response && e.response.data) {
            getel("login-status").innerText = e.response.data;
        } else if (e.response) {
            getel("login-status").innerText = e.response;
        }
    }
})

function changeUsername() {
    const input = prompt("Enter your new username:")
    if (input != null) {
        axios({
            url: `${apiURL}/settings/username`,
            method: "POST",
            headers: {
                "authorization": localStorage.getItem("efc-usertoken")
            },
            data: {
                username: input
            },
            timeout: 5000
        }).then(res => {
            location.reload();
        }).catch(e => {
            console.error(e);
            if (e.response && e.response.data) {
                alert(e.response.data);
            } else if (e.response) {
                alert(e.response);
            }
        })
    } else {
        alert("Cancelled");
    }
}
function changePassword() {
    const input = prompt("Enter your new password:")
    if (input != null) {
        axios({
            url: `${apiURL}/settings/password`,
            method: "POST",
            headers: {
                "authorization": localStorage.getItem("efc-usertoken")
            },
            data: {
                password: input
            },
            timeout: 5000
        }).then(res => {
            location.reload();
        }).catch(e => {
            console.error(e);
            if (e.response && e.response.data) {
                alert(e.response.data);
            } else if (e.response) {
                alert(e.response);
            }
        })
    } else {
        alert("Cancelled");
    }
}

function logout() {
    localStorage.removeItem("efc-usertoken");
    localStorage.removeItem("efc-critter");
    location.reload();
}

function copyshare() {
    navigator.clipboard.writeText(`https://efc.nefarkitti.dev/user/#${userData.username}`)
}

window.addEventListener("hashchange", () => {
    if (!["#login", "#register"].includes(window.location.hash)) {
        location.reload();
    }
})

init()