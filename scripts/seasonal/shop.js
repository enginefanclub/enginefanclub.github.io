const SHOP_WINDOW = document.getElementById("shop-window")

const ICONS_SHOP_LIST = document.getElementById("icons-shop-list")
const CRITTERS_SHOP_LIST = document.getElementById("critters-shop-list")
const SHOP_PREVIEW = document.getElementById("shop-preview")

const PROGRESS_BAR_CONTAINER = document.getElementById("progress-bar-container")
const PROGRESS_CHECK = document.getElementById("progress-check")
const PROGRESS_FILL = document.getElementById("progress-fill")

//1793404801000
const HWDATE = 1793404801000
// 1793491200000
const EXPIRY = 1793491200000

let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}

let totalCount = 0
let totalHas = 0

let ICONS_JSON
let CRITTERS_JSON
let userData

let SELECTED_ITEM = false

let getCurrentCandyAmount = 0

let tabs = ["icons", "critters"]

ICONS_SHOP_LIST.innerHTML = `<span style="padding:0px 4px;">loading...</span>`

function getSpritePosition(posx, posy, sizing) {
    return [posx * -sizing, posy * -sizing]
}

function dateCheck() {
    if (Date.now() < HWDATE) return true;
    if (Date.now() > EXPIRY) return true
}

async function init() {

    if (Date.now() < HWDATE || Date.now() > EXPIRY) return ICONS_SHOP_LIST.innerHTML = `<span style="padding:0px 4px;">shop will open ${moment(HWDATE).fromNow()}</span>`;

    SHOP_WINDOW.style.display = ""

    document.querySelectorAll('.tabbtn').forEach(tabbtn => {

        tabbtn.onclick = function () {

            tabs.forEach(tab => {
                document.getElementById(tab).style.display = "none"
            })
            document.querySelectorAll('.tabbtn').forEach(t => {
                t.classList.remove("selected")
            })

            document.getElementById(tabbtn.getAttribute("data-target")).style.display = ""
            tabbtn.classList.add("selected")

        }

    })

    let getIcons = await axios.get("/assets/jsons/profile/icons.json")
    let getCritters = await axios.get("/assets/jsons/critters.json")
    ICONS_JSON = getIcons.data
    CRITTERS_JSON = getCritters.data

    ICONS_SHOP_LIST.innerHTML = `
    <tr class="headerrow">
    <th><span>Name</span></th>
    <th><span>Price</span></th>
    </tr>
    `

    axios({
        url: `${apiURL}/myself`,
        method: "GET",
        headers: {
            "authorization": localStorage.getItem("efc-usertoken")
        },
        timeout: 5000
    }).then(res => {

        userData = res.data

        getCurrentCandyAmount = userData.candies
        document.getElementById("candy-display").innerHTML = `<img src="/assets/site/seasonal/candy_red.png" alt="">${userData.candies}`

        Object.keys(getIcons.data).forEach(iconkey => {

            let getIcon = getIcons.data[iconkey]

            if (getIcon.category == "2026 Halloween") {

                let newRow = document.createElement("tr")
                newRow.classList.add("shop-list-row")
                newRow.id = iconkey

                let getprice = getIcon.price + "C"

                totalCount++
                if (userData.exclusive_icons.includes(iconkey)) {
                    totalHas++
                    newRow.classList.add("owned")
                    getprice = "OWNED"
                }

                newRow.innerHTML = `
                <td><span>${getIcon.name}</span></td>
                <td class="price">${getprice}</td>
                `

                ICONS_SHOP_LIST.appendChild(newRow)

                newRow.onclick = function () {
                    selectItem(iconkey, "icon", newRow)
                }

            }

        })

        Object.keys(CRITTERS_JSON).forEach(critterkey => {
            let getCritter = CRITTERS_JSON[critterkey]
            if (getCritter.category == "2026 Halloween") {

                let newRow = document.createElement("tr")
                newRow.classList.add("shop-list-row")
                newRow.id = critterkey

                let getprice = getCritter.price + "C"

                totalCount++
                if (userData.critters.includes(critterkey)) {
                    totalHas++
                    newRow.classList.add("owned")
                    getprice = "OWNED"
                }

                newRow.innerHTML = `
                <td><span>${getCritter.name}</span></td>
                <td class="price">${getprice}</td>
                `

                CRITTERS_SHOP_LIST.appendChild(newRow)

                newRow.onclick = function () {
                    selectItem(critterkey, "critter", newRow)
                }

            }
        })

        PROGRESS_CHECK.innerText = `${totalHas}/${totalCount}`
        PROGRESS_FILL.style.width = `${(totalHas / totalCount) * 100}%`
        PROGRESS_BAR_CONTAINER.style.display = ""

        if (totalHas / totalCount == 1) {
            getel("trophy-reward").style.filter = "drop-shadow(0px 0px 2px #cc6d14)"
        }

        getel("purchase-button").onclick = function () {
            if (SELECTED_ITEM != false) {
                purchaseItem(SELECTED_ITEM)
            }
        }

    })

}

function selectItem(id, typ, elm) {

    if (dateCheck()) return console.warn("not yet!")

    if (elm.classList.contains("owned")) return;
    if (userData.exclusive_icons.includes(id) && typ == "icon") return;
    if (userData.critters.includes(id) && typ == "critter") return;

    let getData
    let getSpriteSize

    if (typ == "icon") getData = ICONS_JSON[id]; getSpriteSize = 100;
    if (typ == "critter") getData = CRITTERS_JSON[id]; getSpriteSize = 50

    updateShopPreview({ id: id, type: typ, })

    document.querySelectorAll(".shop-list-row").forEach(elm => {
        elm.classList.remove("selected")
    })
    document.getElementById(id).classList.add("selected")

    SELECTED_ITEM = id

}

function resetState() {

    SELECTED_ITEM = false
    updateShopPreview(false)
    document.querySelectorAll("tr.selected").forEach(e => {
        e.classList.remove("selected")
    })

}

function getel(id) {
    return document.getElementById(id)
}

function updateShopPreview(item) {

    if (item) {

        let getData

        if (item.type == "icon") getData = ICONS_JSON[item.id];
        if (item.type == "critter") getData = CRITTERS_JSON[item.id];

        getel("preview-name").innerText = getData.name
        getel("preview-type").innerText = capitalizeFirstLetter(item.type)
        getel("preview-cost").innerText = getData.price

        switch (item.type) {
            case "icon":
                let getOffset = getSpritePosition(getData.pos[0], getData.pos[1], 100)
                getel("preview-icon").style.backgroundImage = `url('/assets/profile/icons.png')`
                getel("preview-icon").style.backgroundPosition = `${getOffset[0]}px ${getOffset[1]}px`
                break;
            case "critter":
                getel("preview-icon").style.backgroundImage = `url('/assets/sprites/critters/${item.id}.png')`
                getel("preview-icon").style.backgroundPosition = `0px 0px`
                break;
            default:
                break;
        }

    } else {

        getel("preview-name").innerText = "?"
        getel("preview-type").innerText = "?"
        getel("preview-cost").innerText = "?"
        getel("preview-icon").style.backgroundImage = `url('/assets/profile/icons.png')`
        getel("preview-icon").style.backgroundPosition = `-500px -600px`

    }

}

function purchaseItem(id) {
    console.log(`trying to purchase ${id}`)
    axios({
        url: `${apiURL}/buy/${id}`,
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("efc-usertoken")
        },
        timeout: 5000
    }).then(res => {

        let getJSON
        let getType
        if (id in ICONS_JSON) {
            getJSON = ICONS_JSON
            getType = "icon"
        }
        if (id in CRITTERS_JSON) {
            getJSON = CRITTERS_JSON
            getType = "critter"
        }
        if (!getJSON) return console.warn(`what the hell is ${id}`)

        getel(id).classList.add("owned")
        getel(id).querySelector(".price").innerText = "OWNED"

        getCurrentCandyAmount -= getJSON[id].price
        getel("candy-display").innerHTML = `<img src="/assets/site/seasonal/candy_red.png" alt="">${getCurrentCandyAmount}`

        totalHas++

        PROGRESS_CHECK.innerText = `${totalHas}/${totalCount}`
        PROGRESS_FILL.style.width = `${(totalHas / totalCount) * 100}%`

        if (totalHas / totalCount == 1) {
            getel("trophy-reward").style.filter = "drop-shadow(0px 0px 2px #cc6d14)"
        }

        displayReward({
            id: id,
            type: getType,
        })

        resetState()

    }).catch(e => {
        if (e && e.response && e.response.data) {
            switch (e.response.data) {
                case "You already bought that!":
                    console.log("alrewady")
                    break;
                case "Not enough candies!":
                    console.log("not enough")
                    break;
                default:
                    console.log("defaulted")
                    break;
                // unknwon error
            }
            //alert(e.response.data) // TODO: change this! This happens if for example the
        } else {
            console.error(e)
            console.log("??? fuck knows")
        }
    })
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function updateTime() {
    if (!dateCheck()) {
        document.getElementById("notyet").innerHTML = ``
        timeleft()
        return init()
    } else {
        document.getElementById("notyet").innerHTML = `shop's closed! check back in ${moment(HWDATE).fromNow()}`
        setTimeout(() => {
            return updateTime()
        }, 1000);
    }
}

function timeleft() {
    document.getElementById("notyet").innerHTML = `expiring ${moment(EXPIRY).fromNow()}`
    if (Date.now() > EXPIRY) {
        location.reload()
    } else {
        setTimeout(() => {
            return timeleft()
        }, 1000);
    }
}

function displayReward(reward) {
    console.log(reward)
    let jsonTypes = {
        icon: ICONS_JSON,
        critter: CRITTERS_JSON
    }
    let getRewardJSON = jsonTypes[reward.type][reward.id]
    let overlay = document.createElement("div")
    overlay.classList.add("reward-overlay")
    let rewardContent = document.createElement("div")
    rewardContent.classList.add("reward-content")
    rewardContent.innerHTML += `
    <span class="reward-title">Got ${getRewardJSON.name}!</span>
    <div class="reward-preview" id="reward-preview"></div>
    `
    overlay.appendChild(rewardContent)
    document.body.appendChild(overlay)
    switch (reward.type) {
        case "icon":
            let getOffset = getSpritePosition(getRewardJSON.pos[0], getRewardJSON.pos[1], 100)
            getel("reward-preview").style.backgroundImage = `url('/assets/profile/icons.png')`
            getel("reward-preview").style.backgroundPosition = `${getOffset[0]}px ${getOffset[1]}px`
            break;
        case "critter":
            getel("reward-preview").style.backgroundImage = `url('/assets/sprites/critters/${reward.id}.png')`
            getel("reward-preview").style.backgroundPosition = `0px 0px`
            break;
        default:
            break;
    }
    setTimeout(() => {
        overlay.remove()
    }, 1500);
}

updateTime()