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

const apiURL = "https://engine.nefarkitti.dev/efc-backend"

let totalCount = 0
let totalHas = 0

let ICONS_JSON
let CRITTERS_JSON
let userData

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

        Object.keys(getIcons.data).forEach(iconkey => {

            let getIcon = getIcons.data[iconkey]

            if (getIcon.category == "2026 Halloween") {

                let newRow = document.createElement("tr")
                newRow.classList.add("shop-list-row")
                newRow.id = iconkey

                newRow.innerHTML = `
                <td><span>${getIcon.name}</span></td>
                <td class="price">${getIcon.price}C</td>
                `

                totalCount++
                if (userData.exclusive_icons.includes(iconkey)) {
                    totalHas++
                    newRow.classList.add("owned")
                }

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

                newRow.innerHTML = `
                <td><span>${getCritter.name}</span></td>
                <td class="price">${getCritter.price}C</td>
                `

                totalCount++
                if (userData.critters.includes(critterkey)) {
                    totalHas++
                    newRow.classList.add("owned")
                }

                CRITTERS_SHOP_LIST.appendChild(newRow)

                newRow.onclick = function () {
                    selectItem(critterkey, "critter", newRow)
                }

            }
        })

        PROGRESS_CHECK.innerText = `${totalHas}/${totalCount}`
        PROGRESS_FILL.style.width = `${(totalHas / totalCount) * 100}%`
        PROGRESS_BAR_CONTAINER.style.display = ""

    })

}

init()

function selectItem(id, typ, elm) {

    if (dateCheck()) return console.warn("not yet!")

    if (elm.classList.contains("owned") || userData.exclusive_icons.includes(id)) return;

    let getData
    let getSpriteSize

    if (typ == "icon") getData = ICONS_JSON[id]; getSpriteSize = 100;
    if (typ == "critter") getData = CRITTERS_JSON[id]; getSpriteSize = 50

    SHOP_PREVIEW.innerHTML = `
<span class="preview-name">${getData.name}</span>
<div class="preview-icon" id="preview-icon"></div>

<div class="preview-lines">
    <span class="preview-line"><span>Type:</span><span>${capitalizeFirstLetter(typ)}</span></span>
    <span class="preview-line"><span>Cost:</span><span>${getData.price}C</span></span>
    <button>Purchase</button>
    <span class="preview-line"><span class="desc extra"></span></span>
</div>
    `

    document.querySelectorAll(".shop-list-row").forEach(elm => {
        elm.classList.remove("selected")
    })
    document.getElementById(id).classList.add("selected")

    let icon_preview = document.getElementById("preview-icon")

    switch (typ) {
        case "icon":
            let getOffset = getSpritePosition(getData.pos[0], getData.pos[1], 100)
            icon_preview.style.backgroundImage = `url('/assets/profile/icons.png')`
            icon_preview.style.backgroundPosition = `${getOffset[0]}px ${getOffset[1]}px`
            break;
        case "critter":
            icon_preview.style.backgroundImage = `url('/assets/sprites/${id}.png')`
            icon_preview.style.backgroundPosition = `0px 0px`
            break;
        default:
            break;
    }

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

updateTime()