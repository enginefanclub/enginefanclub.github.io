let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}
apiURL = "https://engine.nefarkitti.dev/efc-backend"
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

if (localStorage.getItem("efc-usertoken") != null || window.location.hash.length > 1) {
    axios.get("/assets/jsons/profile/icons.json").then(iconRes => {
        const badgesResponse = axios.get("/assets/jsons/profile/badges.json")
        const userCrittersResponse = axios.get("/assets/jsons/critters.json")
        const userTrophiesResponse = axios.get("/assets/jsons/profile/trophies.json")
        const iconData = iconRes.data;
        const userName = window.location.hash.replace("#", "");
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
                console.log(userData)
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
            document.title = userData.username + " - Engine Fan Club"
            getel("username").innerText = userData.username;
            getel("joined").innerText = moment(userData.joined).format("DD/MM/YYYY");
            getel("lastOnline").innerText = moment(userData.lastOnline).fromNow();
            getel('profile-banner').style.backgroundColor = userData.badgeColor;

            //currencies for fun
            if (userData.candies >= 1) {
                getel("show-currency").style.display = ""

                getel("currency-container").innerHTML+=`<div><img src="/assets/site/seasonal/candy_red.png" alt="">${userData.candies}</div>`
            }

            //trophies
            userTrophiesResponse.then(trohpiesData => {
                let trophiesJSON = trohpiesData.data
                let hasTrophies = 0
                if (!checkingOtherUser) {
                    getel('trophy-container').style.display = ""
                    Object.keys(trophiesJSON).forEach(trophy => {
                        let getTrophy = trophiesJSON[trophy]
                        let getTrophyPos = getSpritePosition(getTrophy.pos[0], getTrophy.pos[1], 32)
                        let trophyDiv = document.createElement("div")
                        trophyDiv.classList.add("trophy")
                        trophyDiv.style.backgroundPosition = `${getTrophyPos[0]}px ${getTrophyPos[1]}px`
                        if (!userData.trophies.includes(trophy)) trophyDiv.style.filter = "brightness(0%)";
                        if (userData.trophies.includes(trophy)) hasTrophies++;
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
                                trophyDiv.title = getTrophy.name
                                trophyDiv.classList.add("trophy")
                                trophyDiv.style.backgroundPosition = `${getTrophyPos[0]}px ${getTrophyPos[1]}px`
                                getel('trophy-grid').appendChild(trophyDiv)
                            }
                        })
                    }
                }
                getel('trophy-count').innerText = `trophies (${hasTrophies}/${Object.keys(trophiesJSON).length})`
            })
            //badges
            badgesResponse.then(badgeres => {
                if (userData.badges.length >= 1) {
                    let badgeList = document.createElement("div")
                    badgeList.classList.add("badges")
                    userData.badges.forEach(badge => {
                        let badgeData = badgeres.data[badge]
                        let badgeEl = document.createElement("div")
                        badgeEl.classList.add("badge")
                        let getBadgePos = getSpritePosition(badgeData.pos[0], badgeData.pos[1], 32)
                        badgeEl.style.backgroundPosition = `${getBadgePos[0]}px ${getBadgePos[1]}px`
                        badgeEl.title = badgeData.name
                        badgeList.appendChild(badgeEl)
                    })
                    getel("username").appendChild(badgeList)
                }
            })
            //critter info
            userCrittersResponse.then(critterdata => {
                critterJSON = critterdata.data
                let dataCritter = userData.critter_selected
                getel('critter-info').innerText = critterJSON[dataCritter].name
            })

            const dataIcon = iconData[userData.icon];
            if (dataIcon) {
                let getSpritePos = getSpritePosition(dataIcon.pos[0], dataIcon.pos[1], 100)
                getel('profile-icon').style.backgroundPosition = `${getSpritePos[0]}px ${getSpritePos[1]}px`
            }
            if (checkingOtherUser) {
                getel('setting-divider').hidden = true
                getel("profile-settings").hidden = true;
                sethide("window-profile", false);
                sethide("window-load", true);
                return;
            }

            localStorage.setItem("efc-critter", userData.critter_selected);
            let checkedcritter
            userData.critters.forEach(critter => {
                const button = document.createElement("button");

                button.classList.add("critter");
                if (userData.critter_selected == critter) {
                    getel('critter-preview').style.backgroundImage = `url('/assets/sprites/critters/${critter}.png')`
                    button.classList.add("check");
                    checkedcritter = button
                }
                button.id = critter;
                button.style.backgroundImage = `url('/assets/sprites/critters/${critter}.png')`

                button.onclick = function () {
                    // if (critter == userData.critter_selected) return;
                    if (socket != null) {
                        socket.emit('changesprite', critter);
                        localStorage.setItem("efc-critter", critter);
                        checkedcritter.classList.remove("check")
                        for (const child of getel("critters").children) {
                            if (child.id == critter) {
                                getel('critter-preview').style.backgroundImage = `url('/assets/sprites/critters/${critter}.png')`
                                if (critterJSON) getel('critter-info').innerText = critterJSON[critter].name;
                                button.classList.add("check")
                                checkedcritter = button
                            }
                        }
                    }
                }
                getel("critters").appendChild(button);
            })
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
            bannerColours.forEach(colour => {
                const button = document.createElement("button");

                button.classList.add("banner-col");
                if (userData.badgeColor == colour) {
                    button.classList.add("check");
                    checkedbanner = button
                }
                button.id = colour.replace("#", "");
                button.style.backgroundColor = colour;

                button.onclick = async function () {
                    // if (colour == userData.badgeColor) return;
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
                        for (const child of getel("banner-cols").children) {
                            if (child.id == colour.replace("#", "")) {
                                getel('profile-banner').style.backgroundColor = colour;
                                button.classList.add("check")
                                checkedbanner = button
                            }
                        }
                    }).catch(e => {
                        console.error(e);
                        if (e.response && e.response.data) {
                            alert(e.response.data);
                        } else if (e.response) {
                            alert(e.response);
                        }
                    })
                }
                getel("banner-cols").appendChild(button);
            })
            let checkedicon
            for (const [iconName, data] of Object.entries(iconData)) {

                if (!data.default && !userData.exclusive_icons.includes(iconName)) continue;
                const button = document.createElement("button");

                button.classList.add("icon");
                if (userData.icon == iconName) {
                    button.classList.add("check");
                    checkedicon = button
                }
                button.id = `${iconName}-id`;
                let getSpritePos = getSpritePosition(data.pos[0], data.pos[1], 100)
                button.style.backgroundPosition = `${getSpritePos[0]}px ${getSpritePos[1]}px`

                button.onclick = async function () {
                    //if (iconName == userData.icon) return;
                    axios({
                        url: `${apiURL}/settings/icon`,
                        method: "POST",
                        headers: {
                            "authorization": localStorage.getItem("efc-usertoken")
                        },
                        data: {
                            icon: iconName
                        },
                        timeout: 5000
                    }).then(res => {
                        checkedicon.classList.remove("check")
                        for (const child of getel("profile-icons").children) {
                            if (child.id == `${iconName}-id`) {

                                //setting profile icon
                                getel('profile-icon').style.backgroundPosition = `${getSpritePos[0]}px ${getSpritePos[1]}px`

                                button.classList.add("check")
                                checkedicon = button
                            }
                        }
                    }).catch(e => {
                        console.error(e);
                        if (e.response && e.response.data) {
                            alert(e.response.data);
                        } else if (e.response) {
                            alert(e.response);
                        }
                    })
                }
                getel("profile-icons").appendChild(button);
            }
            sethide("window-profile", false);
            sethide("window-load", true);
        }).catch(e => {
            sethide("window-auth", false);
            sethide("window-load", true);
        })
    })
} else {
    sethide("window-auth", false);
    sethide("window-load", true);
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