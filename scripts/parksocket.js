// hi my name is emily

let sprites = []

let socket = null;

function startSocket() {
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
    /*const socket = io.connect("http://localhost:3000", {
        reconnect: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        auth: {
            token: localStorage.getItem('efc-identifier')
        }
    });*/

    socket.on('reconnect', (sprites) =>{
        console.log("I DONT WANT TO FUCKING RECONNECT", sprites)
        sprites.forEach(data => {
            addSprite(data.id, false, data.ip)
        })
        socket.emit('addsprite', 'test')
    })

    socket.on('addsprite', (ip, id)=>{
        console.log(id)
        addSprite(id, false, ip)
        
    })

    socket.on('delsprite', (ip) =>{
        removeSprite(ip)
    })

    socket.on('changesprite', (ip, newid, oldid)=>{
        removeSprite(ip)
        addSprite(newid, false, ip)
    })

    socket.on('disconnect', () => {
        sprites.forEach(sprite => {
            removeSprite(sprite.identifier)
        })
        //window.location.href = "https://http.cat/418"
    })

    addSprite('duck', true)
}
let e = setInterval(function() {
    if (document.body) {
        startSocket()
        clearInterval(e);
    }
}, 1000)