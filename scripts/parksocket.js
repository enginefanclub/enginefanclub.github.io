// hi my name is emily

const ANNOUNCEMENT_OVERLAY = document.createElement("div")
ANNOUNCEMENT_OVERLAY.classList.add("announcement-overlay")

let sprites = [];
let announcementsArray = []
let spectators = [];

let socket = null;

function startSocket(withAddSprite) {
    if (localStorage.getItem("efc-identifier") == null) localStorage.setItem("efc-identifier", Date.now().toString())
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
        socket = io.connect("http://localhost:3000", {
            reconnect: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            auth: {
                token: localStorage.getItem("efc-usertoken") == null ? localStorage.getItem('efc-identifier') : localStorage.getItem("efc-usertoken"),
                id: localStorage.getItem('efc-identifier')
            }
        });
    } else {
        socket = io.connect("https://engine.nefarkitti.dev", {
            path: "/efc-backend/socket.io/",
            reconnect: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            auth: {
                token: localStorage.getItem("efc-usertoken") == null ? localStorage.getItem('efc-identifier') : localStorage.getItem("efc-usertoken"),
                id: localStorage.getItem('efc-identifier')
            }
        });
    }
    /**/
    socket.on('reconnect', (getsprites, announcements) => {
        announcementsArray = announcements
        if (withAddSprite) {
            getsprites.filter(data => data.id != null).forEach(data => {
                addSprite(data.id, false, data.ip, data.username)
            })
            socket.emit('addsprite')
        }
        spectators = getsprites.filter(data => data.id == null).map(x => {
            return x.ip
        })
    })
    if (withAddSprite) {

        socket.on('addsprite', (ip, id, username) => {
            console.log(id)
            addSprite(id, false, ip, username)
        })

        socket.on('delsprite', (ip) => {
            removeSprite(ip)
        })

        socket.on('changesprite', (ip, newid, oldid, username) => {
            removeSprite(ip)
            addSprite(newid, false, ip, username)
        })

        socket.on('disconnect', () => {
            sprites.filter(data => data.id != null).forEach(sprite => {
                removeSprite(sprite.identifier)
            })
            //window.location.href = "https://http.cat/418"
        })
        if (localStorage.getItem("efc-critter") != null) {
            addSprite(localStorage.getItem("efc-critter"), true)
        }
    } else {
        socket.on('reconnect', (sprites) => {
            socket.emit('addsprite')
        })
    }
    socket.on('addspectator', (ip) => {
        spectators.push(ip)
    })
    socket.on('delspectator', (ip) => {
        spectators.splice(spectators.indexOf(ip), 1)
    })
    socket.on('youarespectator', () => {
        spectators.push(localStorage.getItem('efc-identifier'))
    })
    socket.on("announcement", (packet) => {
        announcementsArray.push(packet)
    })
}
let e = setInterval(function () {
    if (document.body) { // wont scream if it doesnt exist now
        startSocket(typeof addSprite == "function")
        clearInterval(e);
    }
}, 1000)

let setup = false
function updateAnnouncements() {

    if (!setup && document.body) {
        document.body.appendChild(ANNOUNCEMENT_OVERLAY)
        setup = true
    }

    ANNOUNCEMENT_OVERLAY.innerHTML = ``

    for (let i = 0; i < announcementsArray.length; i++) {
        const announcement = announcementsArray[i];
        if (Date.now() > announcement.started + announcement.duration) {
            console.log(`announcement overstayed its welcome, goodbye!`)
            announcementsArray.splice(announcementsArray.map(e => e.id).indexOf(announcement.id), 1)
        }
    }

    announcementsArray.forEach(announcement => {

        let newAnnouncement = document.createElement("div")
        newAnnouncement.classList.add("announcement")

        newAnnouncement.innerHTML = `
        <span class="extra">-- ANNOUNCEMENT --</span>
        <span class="author">${announcement.author}</span>
        <span class="content">${announcement.content}</span>
        <span class="extra">-- ANNOUNCEMENT --</span>
        `

        ANNOUNCEMENT_OVERLAY.appendChild(newAnnouncement)

    })

    let er = setInterval(() => {
        clearInterval(er)
        return updateAnnouncements()
    }, 1000);
}

updateAnnouncements()