let apiURL = "https://engine.nefarkitti.dev/efc-backend"
//let apiURL = "http://localhost:3000"

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
            /*
            <div class="dashboard-user">
                <div class="dashboard-user-icon"></div>
                <div class="dashboard-user-details">
                    <h4>nefarkitt (userid)</h4>
                    <div id="dashboard-user-buttons">
                        <button>give icon</button>
                        <button>give badge</button>
                        <button>give critter</button>
                    </div>
                </div>
            </div>
            */
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

            const giveIconBtn = document.createElement("button");
            giveIconBtn.innerText = "give icon";
            giveIconBtn.onclick = function() {
                let input = prompt("what icon?");
                if (input != null) {
                    if (iconData[input]) {
                        giveToUser(user.user_id, "icon", input)
                        return;
                    } else {
                        alert("thats not valid... (cant find in icons.json)")
                    }
                } else {
                    alert("cancelled")
                }
            }
            const giveBadgeBtn = document.createElement("button");
            giveBadgeBtn.innerText = "give badge";
            giveBadgeBtn.onclick = function() {
                let input = prompt("what badge?");
                if (input != null) {
                    if (badgeData[input]) {
                        giveToUser(user.user_id, "badge", input)
                        return;
                    } else {
                        alert("thats not valid... (cant find in badges.json)")
                    }
                } else {
                    alert("cancelled")
                }
            }
            const giveCritterBtn = document.createElement("button");
            giveCritterBtn.innerText = "give critter";
            giveCritterBtn.onclick = function() {
                let input = prompt("what critter?");
                if (input != null) {
                    if (critterData[input]) {
                        giveToUser(user.user_id, "critter", input)
                        return;
                    } else {
                        alert("thats not valid... (cant find in critters.json)")
                    }
                } else {
                    alert("cancelled")
                }
            }
            buttonDiv.appendChild(giveIconBtn);
            buttonDiv.appendChild(giveBadgeBtn);
            buttonDiv.appendChild(giveCritterBtn);

            userDetailDiv.appendChild(h4Username);
            userDetailDiv.appendChild(buttonDiv);

            div.appendChild(userIcon);
            div.appendChild(userDetailDiv);

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
            if (!JSON.parse(myselfData.badges).includes("admin")) {
                if (Math.floor(Math.random() * 50) < 25) {
                    window.location.href = "/"
                } else {
                    window.close()
                }
                return;
            }
            iconData = iconRes.data;
            const badgeRes = await axios.get(`/assets/jsons/profile/badges.json`);
            badgeData = badgeRes.data;
            const critterRes = await axios.get(`/assets/jsons/critters.json`);
            critterData = critterRes.data;
            refreshPage();
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