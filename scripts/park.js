const canvas_container = document.getElementById("canvas-container")
const canvas = document.getElementById("park")
const ctx = canvas.getContext("2d")

const FLOOR_HEIGHT = canvas.height - 39
const SPRITE_SIZE = 40
const BORDER_WIDTH = 1

let SPRITESHEETS
let HOVERING
let ticks = 0
let tickrate = 20
let animfreq = 10
let mousex = 0
let mousey = 0

function addSprite(id, isself = false, identifier = "") {
    const img = new Image();
    img.src = `/assets/sprites/${id}.png`;

    sprites.push({
        "id": id,
        "name": id,
        "identifier": identifier,
        "src": img,
        "pos": [Math.round(canvas.width * Math.random()), FLOOR_HEIGHT],
        "goal": getSpriteGoal(),
        "move": 0,
        "frame": 0,
        "facing": 0, // some hacky shit
        "z": sprites.length,
        "isself": isself,
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
    if (goal >= canvas.width - 41) goal = canvas.width - 41
    return goal
}

function renderSprite(spr) {
    let sprstate = ""
    let sheets = SPRITESHEETS[spr.id]

    let spritesheet = `/assets/sprites/${spr.id}.png`
    if (spr.goal == 0) {
        sprstate = "idle"
    } else {
        sprstate = "walk"
    }
    if (ticks % animfreq == 0) spr.frame++;
    if (spr.frame > sheets[sprstate].length - 1) spr.frame = 0;

    spr.src.src = spritesheet


    ctx.drawImage(spr.src, 40 * sheets[sprstate][spr.frame], 40 * spr.facing, SPRITE_SIZE, SPRITE_SIZE, spr.pos[0], spr.pos[1], SPRITE_SIZE, SPRITE_SIZE)
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center"
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, 150);

    sprites.forEach(spr => {
        if (spr.pos[0] >= canvas.width - 40) spr.pos[0] = canvas.width - 40
        if (spr.pos[0] <= 0) spr.pos[0] = 0

        renderSprite(spr)

        if (spr.isself) {
            ctx.fillStyle = "red";
            ctx.font = "20px";
            ctx.fillText(`YOU`, spr.pos[0] + 20, 35);
        }

        if (HOVERING) {
            if (mousex >= spr.pos[0] && mousex <= spr.pos[0] + 40 && mousey >= FLOOR_HEIGHT) {

                if (spr.isself) return;
                ctx.fillStyle = "black";
                ctx.font = "20px";
                ctx.fillText(`${spr.name}`, spr.pos[0] + 20, 35);

            }
        }

    })

    ctx.textAlign = "left"

    ctx.fillStyle = "black";
    ctx.font = "18px DotGothicMPLUS1Code";
    ctx.fillText(`${sprites.length} users connected`, 5, 15);

}

function tick() {

    ticks++
    if (ticks >= tickrate) {
        ticks = 0
    }

    sprites.forEach(sprite => {
        if (sprite.goal != 0) {
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
            }
        } else {
            sprite.move -= 1
            if (sprite.move == 0) {
                sprite.goal = getSpriteGoal()
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
function getCanvasMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y]
}

/*function resizeCanvasWindow() {
    ctx.canvas.width = Math.floor(canvas_container.offsetWidth)
    canvas.width = Math.floor(canvas_container.offsetWidth)
    draw()
}
addEventListener("resize", (event) => { resizeCanvasWindow() })

axios.get('/assets/jsons/sheets.json').then(res => {
    if (res.data) {

        SPRITESHEETS = res.data

        resizeCanvasWindow()
        draw()
        tick()
    }
})*/