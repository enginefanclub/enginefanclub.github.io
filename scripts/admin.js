let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}

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

let iconData = null;
let badgeData = null;
let critterData = null;

async function refreshPage() {
    seenIDs = []
    if (iconData == null || badgeData == null || critterData == null) return;
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
        const userListDiv = getel('user-list');
        userListDiv.innerHTML = "";
        users.forEach(user => {
            const div = document.createElement("div");
            div.classList.add("dashboard-user");

            const userIcon = document.createElement("div");
            userIcon.classList.add("dashboard-user-icon");

            const dataIcon = iconData[user.icon];
            let getSpritePos = getIconSpritePosition(dataIcon.pos[0], dataIcon.pos[1])
            userIcon.style.backgroundPosition = `${getSpritePos[0]}px ${getSpritePos[1]}px`

            const userDetailDiv = document.createElement("div");
            userDetailDiv.classList.add("dashboard-user-details");

            const h4Username = document.createElement("h4");
            h4Username.textContent = `${user.username} (${user.user_id})`
            const buttonDiv = document.createElement("div");
            buttonDiv.classList.add("dashboard-user-buttons");

            userDetailDiv.appendChild(h4Username);
            userDetailDiv.appendChild(buttonDiv);

            div.appendChild(userIcon);
            div.appendChild(userDetailDiv);
            seenIDs.push(user.user_id)

            userListDiv.appendChild(div);
        })
    } catch (e) {
        console.error(e);
        alert("couldn't load users")
    }
}

if (localStorage.getItem("efc-usertoken") != null) {
    axios.get("/assets/jsons/profile/icons.json").then(async iconRes => {
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
                iconData = iconRes.data;
                const badgeRes = await axios.get(`/assets/jsons/profile/badges.json`);
                badgeData = badgeRes.data;
                const critterRes = await axios.get(`/assets/jsons/critters.json`);
                critterData = critterRes.data;
                refreshPage();
            } else {
                window.location.href = "/"
                return;
            }
        } catch (e) {
            console.error(e);
            alert("couldn't load jsons or users")
        }
    })
} else {
    if (Math.floor(Math.random() * 50) < 25) {
        window.location.href = "/"
    } else {
        window.close()
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