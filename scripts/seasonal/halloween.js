//stop peeking
// if this seems incomprehensible to you it is incomprehensible to me too i wrote all of this at like 2am and i have a massive fucking headache
const DISPLAY = getel("display")
const TIMER_SPAN = document.getElementById("hw-timer")

let candy = 0

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

function init() {

    if (dateCheck()) return;

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

        let rolled = "good"
        if (Math.random() <= 0.6) rolled = "bad";

        getel('doorbg').innerHTML += `<p>${LINES[rolled].random()}</p>`

        setTimeout(() => {
            getel(`tot-overlay`).remove()
            response(d, rolled)
        }, 2100);

    }, 600);

}

function response(door, r) {

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

    let handout = [1, 2, 3, 4, 5].random()

    if (r == "good") {
        treat();
        handout += [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].random();
    }
    if (r == "bad") trick();

    candy += handout
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

function treat() {
    if (dateCheck()) return;
    console.log("give em something nice! yeah!")
}
function trick() {
    if (dateCheck()) return;
    let roll = ["gfredy", "skelong"].random()
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