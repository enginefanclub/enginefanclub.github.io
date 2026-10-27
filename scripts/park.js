const canvas_container = document.getElementById("canvas-container")
const canvas = document.getElementById("park")
const ctx = canvas.getContext("2d")

const SPRITE_SIZE = 50
const FLOOR_HEIGHT = (SPRITE_SIZE - 19)
const BORDER_WIDTH = 1

let SPRITESHEETS
let HOVERING
let HOVERING_OVER
let ticks = 0
let tickrate = 20
let animfreq = 10
let mousex = 0
let mousey = 0

let totalSpriteCount = 0
function addSprite(id, isself = false, identifier = "", username = "") {
    totalSpriteCount++
    const img = new Image();
    img.src = `/assets/sprites/${id}.png`;

    sprites.push({
        "id": id,
        "name": username,
        "identifier": identifier,
        "src": img,
        "pos": [Math.round(canvas.width * Math.random()), FLOOR_HEIGHT],
        "goal": getSpriteGoal(),
        "move": 0,
        "frame": 0,
        "facing": 0, // some hacky shit
        "z": totalSpriteCount,
        "isself": isself,
        "state": "idle",
        "emote": 0,
        "emoteTime": -1
    })
}
function removeSprite(identifier) {

    for (let i = 0; i < sprites.length; i++) {
        let sprite = sprites[i]
        if (sprite.identifier == identifier) {
            sprite.src.remove()
            sprites.splice(i, 1)
            break
        }
    }
}

function getSpriteGoal() {
    let goal = Math.round(canvas.width * Math.random())
    if (goal <= 0) goal = 0;
    if (goal >= canvas.width - (SPRITE_SIZE + 1)) goal = canvas.width - (SPRITE_SIZE + 1)
    return goal
}

function renderSprite(spr) {
    let sprstate = ""
    let sheets = SPRITESHEETS[spr.id]

    let spritesheet = `/assets/sprites/${spr.id}.png`
    let toRender
    let animLength

    if (spr.state != "emote") {
        toRender = sheets[spr.state][spr.frame]
        animLength = sheets[spr.state].length
    } else {
        toRender = spr.emote[spr.frame]
        animLength = spr.emote.length
    }

    if (ticks % animfreq == 0) spr.frame++;
    if (spr.frame > animLength - 1) spr.frame = 0;

    spr.src.src = spritesheet

    ctx.drawImage(spr.src, SPRITE_SIZE * toRender, SPRITE_SIZE * spr.facing, SPRITE_SIZE, SPRITE_SIZE, spr.pos[0], spr.pos[1], SPRITE_SIZE, SPRITE_SIZE)
}
function draw() {

    //???  https://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element
    ctx.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center"
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, 150);

    sprites.forEach(spr => {
        if (spr.pos[0] >= canvas.width - SPRITE_SIZE) spr.pos[0] = canvas.width - SPRITE_SIZE
        if (spr.pos[0] <= 0) spr.pos[0] = 0

        renderSprite(spr)

        if (spr.isself) {
            ctx.font = "20px";
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2
            ctx.strokeText("\\/", spr.pos[0] + 25 + 0.5, 40)
            ctx.fillStyle = "red"
            ctx.fillText(`\\/`, spr.pos[0] + 25, 40);
        }

        if (HOVERING) { // fix this for overlapping sprites later
            if (mousex >= spr.pos[0] && mousex <= spr.pos[0] + SPRITE_SIZE && mousey >= FLOOR_HEIGHT) {
                HOVERING_OVER = spr
                if (spr.isself) return;
                ctx.font = "20px";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 3
                ctx.strokeText(spr.name, spr.pos[0] + 25 + 0.5, 35)
                ctx.fillStyle = "white"
                ctx.fillText(`${spr.name}`, spr.pos[0] + 25, 35);

            } else {
                HOVERING_OVER = null
            }
        }

    })

    let thing = `${sprites.length} user${sprites.length != 1 ? "s" : ""} connected | ${spectators.length} spectator${spectators.length != 1 ? "s" : ""} connected`

    ctx.textAlign = "left"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.strokeText(thing, 5, 15)
    ctx.fillStyle = "white";
    ctx.font = "22px Cairopixel";
    ctx.fillText(thing, 5, 15);

    /*if (HOVERING_OVER != null) {
        ctx.strokeStyle = "black"
        ctx.fillStyle = "black";
        ctx.fillText(HOVERING_OVER.name, 0, 50);
    }*/

}

function tick() {

    ticks++
    if (ticks >= tickrate) {
        ticks = 0
    }

    sprites.forEach(sprite => {
        if (sprite.goal != 0) {
            sprite.state = "walk"
            if (sprite.goal < sprite.pos[0]) {
                sprite.pos[0]--
                sprite.facing = 1
            }
            if (sprite.goal > sprite.pos[0]) {
                sprite.pos[0]++
                sprite.facing = 0
                if (sprite.goal >= canvas.width) {
                    sprite.goal = getSpriteGoal()
                }
            }
            if (sprite.goal == sprite.pos[0]) {
                sprite.goal = 0
                sprite.move = Math.floor(500 * Math.random()) + 100
                sprite.state = "idle"
            }
        } else {
            if (sprite.state == "idle") {

                if (Math.random() * 100 <= 1 && sprite.state != "emote") {
                    if ("emotes" in SPRITESHEETS[sprite.id]) {
                        let sprite_emotes = SPRITESHEETS[sprite.id].emotes
                        sprite.state = "emote"
                        sprite.emote = sprite_emotes[getRandomInt(sprite_emotes.length)]
                    }
                }

                sprite.move--
                if (sprite.move == 0) {
                    sprite.goal = getSpriteGoal()
                }
            }
            if (sprite.state == "emote") {
                if (sprite.emoteTime == -1) {
                    sprite.emoteTime = sprite.emote.length * ((getRandomInt(50) + 1) + 25)
                }
                sprite.emoteTime--
                if (sprite.emoteTime <= 0) {
                    sprite.emoteTime = -1
                    sprite.state = "idle"
                }
            }
        }
    })

    draw()

    setTimeout(() => {
        tick()
    }, tickrate);
}

canvas.addEventListener("mousemove", (event) => {
    HOVERING = true
    let pos = getCanvasMousePosition(canvas, event)
    mousex = pos[0]
    mousey = pos[1]
})
canvas.addEventListener("mouseleave", (event) => {
    HOVERING = false
})
canvas.addEventListener("click", (event) => {
    console.log(HOVERING_OVER)
    if (HOVERING_OVER != null) {
        window.open(`/user/#${HOVERING_OVER.name}`, '_blank').focus();
    }
})
function getCanvasMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y]
}

function resizeCanvasWindow() {
    ctx.canvas.width = Math.floor(canvas_container.offsetWidth)
    canvas.width = Math.floor(canvas_container.offsetWidth)
    draw()
}
addEventListener("resize", (event) => { resizeCanvasWindow() })

axios.get('/assets/jsons/critters.json').then(res => {
    if (res.data) {

        SPRITESHEETS = res.data

        resizeCanvasWindow()
        draw()
        tick()
    }
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}