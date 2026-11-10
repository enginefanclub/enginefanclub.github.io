let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}

const urlParams = new URLSearchParams(window.location.search);
const userParam = urlParams.get('user');

let iconsJSON
let badgesJSON
let crittersJSON

function getel(id) {
    return document.getElementById(id)
}
function getqueryall(id) {
    return document.querySelectorAll(id);
}

function sethide(id, hide) {
    getel(id).hidden = hide
}

function getIconSpritePosition(posx, posy) {
    return [posx * -100, posy * -100]
}

const PAGE = document.getElementById("page")

let page = 0;
let count = 0;
const user_per_page = 20;

let seenIDs = []

function createPoll(title, desc = "", options = [], expiry) {
    if (!title) return console.warn(`Please provide a title!`);
    if (!expiry) return console.warn("Please provide an expiry date!");
    if (options.length <= 0) return console.warn("please provide options!");
    axios({
        url: `${apiURL}/createpoll`,
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("efc-usertoken")
        },
        data: {
            title,
            desc,
            options,
            expiry
        },
        timeout: 5000
    }).then(res => {
        alert("doned!")
    }).catch(e => {
        console.error(e);
        if (e.response && e.response.data) {
            alert(e.response.data);
        } else if (e.response) {
            alert(e.response);
        }
    })
}

function pruneUser(id) {

    if (id == undefined) return console.warn("please provide a valid id");
    if (!seenIDs.includes(id)) return console.warn("please provide an id you can actually see");

    axios({
        url: `${apiURL}/users/prune`,
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("efc-usertoken")
        },
        data: {
            user_id: id,
        },
        timeout: 5000
    }).then(res => {
        alert("doned!")
        window.location.reload()
    }).catch(e => {
        console.error(e);
        if (e.response && e.response.data) {
            alert(e.response.data);
        } else if (e.response) {
            alert(e.response);
        }
    })

}

function giveToUser(user_id, key, value) {
    axios({
        url: `${apiURL}/users/${user_id}/give`,
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("efc-usertoken")
        },
        data: {
            key,
            value
        },
        timeout: 5000
    }).then(res => {
        alert("doned!")
    }).catch(e => {
        console.error(e);
        if (e.response && e.response.data) {
            alert(e.response.data);
        } else if (e.response) {
            alert(e.response);
        }
    })
}

async function refreshPage() {
    PAGE.classList.add("loading")
    seenIDs = []
    try {
        const usersRes = await axios.get(`${apiURL}/users?page=${page}`);
        const users = usersRes.data.users;
        if (count != usersRes.data.count) {
            count = usersRes.data.count;
            const pageOption = getel('dashboard-user-pages');
            pageOption.innerHTML = "";
            for (let page = 1; page <= Math.ceil(count / user_per_page); page++) {
                const option = document.createElement("option");
                option.value = page - 1;
                option.textContent = page.toString();
                pageOption.appendChild(option);
            }
            pageOption.value = page;
        }
        const userTable = getel('user-table');
        users.forEach(user => {
            const row = document.createElement("tr");
            row.classList.add("user");

            const id = document.createElement("td")
            id.innerText = user.user_id

            const username = document.createElement("td")
            username.innerText = user.username

            row.onclick = function () {
                window.location.href = `/admin/dashboard/?user=${user.username}`
            }

            row.appendChild(id)
            row.appendChild(username)

            userTable.appendChild(row);
        })
        PAGE.classList.remove("loading")
    } catch (e) {
        console.error(e);
        alert("couldn't load users")
    }
}

async function init(params) {
    if (localStorage.getItem("efc-usertoken") != null) {
        iconsJSON = await axios.get("/assets/jsons/profile/icons.json")
        badgesJSON = await axios.get(`/assets/jsons/profile/badges.json`)
        crittersJSON = await axios.get(`/assets/jsons/critters.json`)
        iconsJSON = iconsJSON.data
        badgesJSON = badgesJSON.data
        crittersJSON = crittersJSON.data
        try {
            const myselfRes = await axios({
                url: `${apiURL}/myself`,
                method: "GET",
                headers: {
                    "authorization": localStorage.getItem("efc-usertoken")
                },
                timeout: 5000
            })
            const myselfData = myselfRes.data;
            if (JSON.parse(myselfData.badges).includes("admin") || JSON.parse(myselfData.badges).includes("moderator")) {
                refreshPage();
            } else {
                window.location.href = "/"
                return;
            }
        } catch (e) {
            console.error(e);
            alert("couldn't load jsons or users")
        }
    } else {
        if (Math.floor(Math.random() * 50) < 25) {
            window.location.href = "/"
        } else {
            window.close()
        }
    }
    //
    if (typeof userParam == "string" && userParam.length >= 1) {

        getel("users-tab").style.display = "none"
        getel("user-tab").style.display = ""

        axios({
            url: `${apiURL}/users/${userParam}`,
            method: "GET",
            headers: {
                "authorization": localStorage.getItem("efc-usertoken")
            },
            timeout: 5000
        }).then(res => {

            const usertab = document.getElementById("user-tab")

            const userData = res.data
            let getIconJs = iconsJSON[userData.icon]

            const userName = document.createElement("h3")
            userName.innerText = userData.username
            userName.style.fontWeight = "900"

            const userId = document.createElement("div")
            userId.innerText = `id: ` + userData.user_id

            const userIconName = document.createElement("div")
            userIconName.innerText = `icon: ` + userData.icon

            const userCritterName = document.createElement("div")
            userCritterName.innerText = `critter: ` + userData.critter_selected

            const userTrophies = document.createElement("div")
            userTrophies.innerText = `trophies: ` + userData.trophies

            const userBadges = document.createElement("div")
            userBadges.innerText = `badges: ` + userData.badges

            const userJoinDate = document.createElement("div")
            userJoinDate.innerText = `joined: ` + moment(userData.joined).format('LLL');

            const userCandies = document.createElement("div")
            userCandies.innerText = `candies: ` + userData.candies

            const flexrow = document.createElement("div")
            flexrow.classList.add("flex-row")

            const userIcon = document.createElement("img")
            userIcon.classList.add("user-icon")
            userIcon.style.backgroundImage = `url('/assets/profile/icons/${getIconJs.category}/${userData.icon}.png')`

            const flexcolumn = document.createElement("div")
            flexcolumn.classList.add("flex-column")
            flexcolumn.classList.add("details")

            const actionsDiv = document.createElement("div")
            actionsDiv.classList.add("actions")

            // can
            // prune, give

            const giveBtn = document.createElement("button")
            giveBtn.innerText = `GIVE`

            const pruneBtn = document.createElement("button")
            pruneBtn.innerText = `PRUNE`

            flexcolumn.appendChild(userName)
            flexcolumn.appendChild(userId)
            flexcolumn.appendChild(userIconName)
            flexcolumn.appendChild(userCritterName)
            flexcolumn.appendChild(userTrophies)
            flexcolumn.appendChild(userBadges)
            flexcolumn.appendChild(userJoinDate)
            flexcolumn.appendChild(userCandies)

            flexrow.appendChild(userIcon)
            flexrow.appendChild(flexcolumn)

            usertab.appendChild(flexrow)

            usertab.appendChild(document.createElement("hr"))

            actionsDiv.appendChild(giveBtn)
            actionsDiv.appendChild(pruneBtn)

            usertab.appendChild(actionsDiv)

            console.log(userData)

        }).catch(e => {
            console.error(e)
            //window.location.href = `/admin/dashboard/`
        })

    }
}

function goToPage(value) {
    page = value;
    refreshPage();
}
function nextPage() {
    if ((page + 1) > (Math.ceil(count / user_per_page) - 1)) return;
    page++;
    getel("dashboard-user-pages").value = page.toString();
    refreshPage();
}
function prevPage() {
    if ((page - 1) < 0) return;
    page--;
    getel("dashboard-user-pages").value = page.toString();
    refreshPage();
}

init()