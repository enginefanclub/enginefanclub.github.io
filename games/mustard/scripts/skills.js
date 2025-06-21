const CHARACTERS_TABLE = document.getElementById("characters")
const SKILLS_TABLE = document.getElementById("skills")

const types_list = ["CORP", "SWGE", "SODA", "ABSR", "MINM"]

//values
const ATKPOWER = document.getElementById("atkpower")
const ACCMOD = document.getElementById("accmod")

const SKILLNAME = document.getElementById("skillname")
const BASEDMG = document.getElementById("basedmg")
const ACCURACY = document.getElementById("accuracy")
const REVCOST = document.getElementById("revcost")
const COOLDOWN = document.getElementById("cooldown")
const SKILLTYPING = document.getElementById("skilltyping")
const SKILLDESC = document.getElementById("skilldesc")

const VICNAME = document.getElementById("unitname")
const VICHEALTH = document.getElementById("unithp")
const VICDEF = document.getElementById("unitdef")
const VICDDG = document.getElementById("unitddg")
//values

let DATA
let types = []
let typesres = []

types_list.forEach(type=>{

    types.push(document.getElementById(`${type.toLowerCase()}type`))
    typesres.push(document.getElementById(`${type.toLowerCase()}res`))

})

CHARACTERS_TABLE.innerHTML = ``
SKILLS_TABLE.innerHTML = `<tr><td>Click on a character...</td></tr>`

function updateDMGResult() {

    BASEDMG.value = Math.ceil(BASEDMG.value)

    let damage = BASEDMG.value
    let finalDamage = 0

    let damage3 = Math.round(Math.ceil(damage * ATKPOWER.value) * VICDEF.value)

    //finalDamage = damage

    for (let i = 0; i < 5; i++) {
        
        let type = types[i]
        let typeres = typesres[i]

        let typeDamage = Math.round(damage3 * ((type.value * 1) * ((typeres.value * 1) - 1)))

        finalDamage += typeDamage

    }

    //finalDamage = Math.ceil(damage * defense.value)

    finalDamage += damage3

    finalDamage = Math.round(finalDamage) // THIS IS FOR YOU 1NNING

    let critDamage = finalDamage * 2

    console.log(finalDamage)
    document.getElementById("final").innerHTML = finalDamage

}

function loadCharacter(id) {

    let data = DATA[id]

    VICNAME.value = data.name
    VICHEALTH.value = data.health
    VICDEF.value = data.defense
    VICDDG.value = data.dodge

    //res
    types_list.forEach(type=>{

        document.getElementById(`${type.toLowerCase()}res`).value = data[`${type.toLowerCase()}res`]

    })

    updateDMGResult()

}

function loadSkill(character, skillid) {

    let chr = DATA[character]
    let skill =  chr.skills[skillid]

    SKILLNAME.value = skill.name
    BASEDMG.value = skill.basedamage
    ACCURACY.value = skill.accuracy
    REVCOST.value = skill.revs
    COOLDOWN.value = skill.cooldown
    SKILLTYPING.value = skill.spec
    SKILLDESC.value = skill.extra

    types_list.forEach(type=>{

        document.getElementById(`${type.toLowerCase()}type`).value = skill[`${type.toLowerCase()}`]

    })

    updateDMGResult()

}

function handleCharacter(id) {

    let element = document.getElementById(`character-${id}`)

    if (element.classList.contains("highlighted")) {
        loadCharacter(id)
    }

    document.querySelectorAll(".character").forEach(chr => {
        chr.classList.remove("highlighted")
    })
    element.classList.add("highlighted")

    SKILLS_TABLE.innerHTML = ``

    let skillid = 0
    DATA[id].skills.forEach(skill => {
        SKILLS_TABLE.innerHTML += `<tr><td><button onclick="loadSkill(${id}, ${skillid})">${skill.name}</button></td></tr>`
        skillid++
    })

}

axios.get('jsons/characters.json').then(res => {

    DATA = res.data // should be json by default

    let id = 0
    DATA.forEach(character => {

        CHARACTERS_TABLE.innerHTML += `<tr class="character" onclick="handleCharacter(${id})" id="character-${id}"><td><button>${character.name}</button></td></tr>`

        id++

    });

    updateDMGResult()

}).catch(console.error)