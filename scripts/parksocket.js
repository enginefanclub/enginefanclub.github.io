// hi my name is emily

let sprites = []
let spectators = [];

let socket = null;

function startSocket(withAddSprite) {
    if (localStorage.getItem("efc-identifier") == null) localStorage.setItem("efc-identifier", Date.now().toString())
    socket = io.connect("https://engine.nefarkitti.dev", {
        path: "/efc-backend/socket.io/",
        reconnect: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        auth: {
            token: localStorage.getItem('efc-identifier')
        }
    });
    /*socket = io.connect("http://localhost:3000", {
        reconnect: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        auth: {
            token: localStorage.getItem("efc-usertoken") == null ? localStorage.getItem('efc-identifier') : localStorage.getItem("efc-usertoken"),
            id: localStorage.getItem('efc-identifier')
        }
    });*/
    if (withAddSprite) {
        socket.on('reconnect', (sprites) =>{
            console.log("I DONT WANT TO FUCKING RECONNECT", sprites)
            sprites.filter(data => data.id != null).forEach(data => {
                addSprite(data.id, false, data.ip, data.username)
            })
            spectators = sprites.filter(data => data.id == null).map(x => {
                return x.ip
            })
            socket.emit('addsprite')
        })

        socket.on('addsprite', (ip, id, username)=>{
            console.log(id)
            addSprite(id, false, ip, username)
        })

        socket.on('delsprite', (ip) =>{
            removeSprite(ip)
        })

        socket.on('changesprite', (ip, newid, oldid, username)=>{
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
        socket.on('reconnect', (sprites) =>{
            socket.emit('addsprite')
        })
    }
    socket.on('addspectator', (ip)=>{
        spectators.push({identifier: ip})
    })
    socket.on('delspectator', (ip) => {
        spectators.splice(spectators.indexOf(ip), 1)
    })
    socket.on('youarespectator', () => {
        spectators.push(localStorage.getItem('efc-identifier'))
    })
}
let e = setInterval(function() {
    if (document.body) { // wont scream if it doesnt exist now
        startSocket(typeof addSprite == "function")
        clearInterval(e);
    }
}, 1000)