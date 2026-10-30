let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}

const DISPLAY = getel("display")
const TIMER_SPAN = document.getElementById("hw-timer")


let jsonTypes = {
    icon: {},
    critter: {}
}

// let candy = 0 // replace with user candy balance

let doors = []
let doorCD = {}
let lastOn = 0
let currentDoor = -1

let candies = []

//1793404801000
const HWDATE = 1793404801000
// 1793491200000
const EXPIRY = 1793491200000

function getel(id) {
    return document.getElementById(id)
}

function dateCheck() {
    if (Date.now() < HWDATE) return true;
    if (Date.now() > EXPIRY) return true
}

function getSpritePosition(posx, posy, sizing) {
    return [posx * -sizing, posy * -sizing]
}

function updateTime() {
    TIMER_SPAN.innerText = moment(HWDATE).fromNow();

    if (!dateCheck()) {
        timeleft()
        return init()
    } else {
        setTimeout(() => {
            return updateTime()
        }, 1000);
    }
}

updateTime()

async function init() {

    if (dateCheck()) return;

    try {
        const res = await axios({
            url: `${apiURL}/myself`,
            method: "GET",
            headers: {
                "authorization": localStorage.getItem("efc-usertoken")
            },
            timeout: 5000
        });

        let userdata = res.data

        getel('candy-display').innerHTML = `<img src="/assets/site/seasonal/candy_red.png" alt="">${userdata.candies}`

        console.log("getting icons")
        let fetchIconJSON = await axios.get("/assets/jsons/profile/icons.json")
        jsonTypes.icon = fetchIconJSON.data
        console.log("getting critters")
        let fetchCritterJSON = await axios.get("/assets/jsons/critters.json")
        jsonTypes.critter = fetchCritterJSON.data

        console.log(`loaded `, jsonTypes)

        getel('show-shop').style.display = ""

        let getCDs = localStorage.getItem("efchw-doorcd")
        if (getCDs != null) {
            doorCD = JSON.parse(getCDs)
        }

        let getLastOn = localStorage.getItem("efchw-laston")
        if (getLastOn != null) {
            lastOn = getLastOn
        }
        if ((Date.now() - lastOn) / 1000 >= 3) {
            Object.keys(doorCD).forEach(key => {
                doorCD[key] = Math.floor(doorCD[key] - ((Date.now() - lastOn) / 1000))
                if (doorCD[key] < 0) doorCD[key] = 0;
            })
        }
        localStorage.setItem("efchw-laston", Date.now())

        DISPLAY.innerHTML = `<h5>Somewhere, Something Street</h5>`

        let doorContainer = document.createElement("div")
        doorContainer.classList.add("doors-contain")
        DISPLAY.appendChild(doorContainer)

        for (let i = 0; i < 5; i++) {
            let door = document.createElement("button")
            door.classList.add("door")
            door.id = `${i + 1}`

            let doorname = document.createElement("span")
            doorname.innerText = `${i + 1}`
            door.appendChild(doorname)

            let img = document.createElement("img")
            img.src = "/assets/site/seasonal/door_closed.png"
            door.appendChild(img)

            doorContainer.appendChild(door)
            doors.push(door)

            door.onclick = function () {
                clickOnDoor(i + 1)
            }
        }

        timer()

    } catch (e) {
        document.getElementById("notyet").remove()
        document.getElementById("display").innerHTML = `you need <a href="/user">an account</a> to participate in this event!`
    }

}

function timer() {

    if (dateCheck()) return;

    localStorage.setItem("efchw-laston", Date.now())
    if (Object.keys(doorCD).length >= 1) {

        Object.keys(doorCD).forEach(key => {
            if (doorCD[key] > 0 && currentDoor != parseInt(key)) {
                getel(`${key}`).disabled = true
                doorCD[key]--
                getel(`${key}`).setAttribute("data-timer", doorCD[key])
                if (doorCD[key] == 0) {
                    getel(`${key}`).disabled = false
                }
                localStorage.setItem("efchw-doorcd", JSON.stringify(doorCD))
            }
        })
    }

    setTimeout(() => {
        return timer()
    }, 1000);
}

function clickOnDoor(door) {

    if (dateCheck()) return;

    currentDoor = door
    console.log(`clicked on door ${door}`)

    doors.forEach(d => {
        d.disabled = true
    })

    doorCD[door] = 180
    getel(`${door}`).setAttribute("data-timer", doorCD[door])

    localStorage.setItem("efchw-doorcd", JSON.stringify(doorCD))

    let overlay = document.createElement("div")
    overlay.classList.add("tot-overlay")
    overlay.id = "tot-overlay"


    document.body.appendChild(overlay)

    playSoundEffect("/assets/sounds/knocking.mp3")

    let window = document.createElement("div")
    window.classList.add("tot-window")
    window.id = `tot-window`
    getel(`tot-overlay`).appendChild(window)

    window.innerHTML += `<div id="doorbg" class="doorbg" style="background-image:url('/assets/site/seasonal/door_closed.png');">
    <h2>Trick or treat!</h2>
    <br><br><br><br><br><br>
    </div>`

    setTimeout(() => {

        getSomething(door)

    }, 1700);

}

function getSomething(d) {

    if (dateCheck()) return;

    playSoundEffect("/assets/sounds/door_open.mp3")

    // stupid sound has stupid delay
    setTimeout(() => {
        getel('doorbg').style.backgroundImage = "url('/assets/site/seasonal/door_open.png')"
        axios({
            url: `${apiURL}/doreme`,
            method: "POST",
            headers: {
                "authorization": localStorage.getItem("efc-usertoken")
            },
            data: {
                door_id: d
            },
            timeout: 5000
        }).then(res => {
            const data = res.data;
            let rolled = data.rolled;

            getel('doorbg').innerHTML += `<p>${LINES[rolled].random()}</p>`

            setTimeout(() => {
                getel(`tot-overlay`).remove()
                response(d, rolled, data.handout, data.candy)
            }, 2100);

        })

    }, 600);

}

function response(door, r, handout, candy) {

    if (dateCheck()) return;

    currentDoor = 0
    console.log(doorCD)
    doors.forEach(d => {
        if (d.id in doorCD) {
            d.disabled = true
            if (doorCD[d.id] <= 0) {
                d.disabled = false
            } else {
                d.disabled = true
            }
        } else {
            d.disabled = false
        }
    })
    if (r == "good") {
        treat();
    }
    if (r == "bad") trick();

    spawnCandies(handout)

    getel('candy-display').innerHTML = `<img src="/assets/site/seasonal/candy_red.png" alt="">${candy}`

}
function spawnCandies(amnt) {

    if (dateCheck()) return;

    for (let i = 0; i < amnt; i++) {
        let candy = document.createElement("img")
        candy.setAttribute("data-max-height", `-${getRndInteger(80, 300)}%`)
        candy.classList.add("dropped-candy")
        candy.src = `/assets/site/seasonal/candy_${["red", "green", "blue"].random()}.png`
        document.body.appendChild(candy)
        let s = -1
        if (Math.random() >= 0.5) s = 1
        let randX = getRndInteger(-81, 80) + Math.random()
        candies.push({
            elm: candy,
            pos: [window.innerWidth / 2, (window.innerHeight / 1.8)],
            vel: [randX, getRndInteger(60, 120) - Math.abs(randX)],
            rot: 0,
            rotspeed: getRndInteger(1, 2) + Math.random(),
            side: s,
            life: 100
        })
    }
}

function frame() {

    candies.forEach(c => {

        if (c.pos[0] - c.vel[0] <= 0) {
            c.vel[0] = 0
            c.pos[0] = 16
        }
        if (c.pos[0] - c.vel[0] >= window.innerWidth - 32) {
            c.vel[0] = 0
            c.pos[0] = window.innerWidth - 32
        }
        if (c.pos[1] == window.innerHeight - 40) {
            c.life -= 100
        }
        if (c.pos[1] - c.vel[1] >= window.innerHeight - 40) {
            c.pos[1] = window.innerHeight - 40
            c.vel[1] = 0
        }

        c.elm.style.left = `${c.pos[0]}px`
        c.elm.style.top = `${c.pos[1]}px`
        c.elm.style.transform = `rotate(${c.rot}deg)`

        c.pos[1] -= c.vel[1]
        c.pos[0] -= c.vel[0]
        c.rot += (50 * c.side) * c.rotspeed

        c.vel[1] -= 10
        c.vel[0] -= 0.1

        if (c.life <= 0) {
            c.elm.remove()
            candies.slice(candies.indexOf(c), 1)
        }
    })

    setTimeout(() => {
        return frame()
    }, 100);

}

frame()

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

const LINES = {
    good: [
        "Yea, you know what? You can have something.",
        "I'm feeling quite generous today hmm yes...",
        "Ah you earned it, here."
    ],
    bad: [
        "TRICK!",
        "Heh. Guess what.",
        "I'm feeling quite mischievious today hmm yes...",
        "Behind you."
    ],
}

function displayReward(reward) {
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

function treat() {
    if (dateCheck()) return;
    axios({
        url: `${apiURL}/random`,
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("efc-usertoken")
        },
        timeout: 5000
    }).then(res => {
        displayReward(res.data)
    }).catch(e => {
        if (e && e.response && e.response.data) {
            switch (e.response.data) {
                case "no items to give, sobbing":
                    console.log("no items to give")
                    break;
                case "please contact firee because omg what type is this":
                    console.error("please beat emily to death for this thank you")
                    break;
                default:
                    console.error(e)
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
function trick() {
    if (dateCheck()) return;
    let roll = ["gfredy", "skelong", "rick", "roll"].random()
    switch (roll) {
        case "gfredy":
            let golden = document.createElement("img")
            golden.style.position = "absolute"
            golden.style.width = "100vw"
            golden.style.height = "100dvh"
            golden.style.zIndex = 1000

            document.body.appendChild(golden)

            golden.src = "/assets/site/seasonal/scares/Golden_Freddy.webp"

            setTimeout(() => {
                golden.remove()
            }, 100);
            break;
        case "skelong":
            let skel = document.createElement("img")
            skel.style.position = "absolute"
            skel.style.width = "100vw"
            skel.style.height = "20dvh"
            skel.style.bottom = "0px"
            skel.style.zIndex = 1001

            document.body.appendChild(skel)

            skel.src = "/assets/site/seasonal/scares/skele.gif"

            setTimeout(() => {
                skel.remove()
            }, 1100);
            break;
        case "rick":
            window.open("https://www.youtube.com/watch?v=iupPG8x_Zfo", "_blank")
            break;
        case "roll":
            document.body.style.transform = `rotate(${getRndInteger(-360, 360)}deg)`
        default:
            break;
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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