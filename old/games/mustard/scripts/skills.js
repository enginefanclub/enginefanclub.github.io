const CHARACTERS_TABLE = document.getElementById("characters")
const SKILLS_TABLE = document.getElementById("skills")
const IMPORT = document.getElementById("import")

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
const SKILLID = document.getElementById("skillid")

const VICNAME = document.getElementById("unitname")
const VICHEALTH = document.getElementById("unithp")
const VICDEF = document.getElementById("unitdef")
const VICDDG = document.getElementById("unitddg")
const VICID = document.getElementById("unitid")
//values

let DATA
let SAVEDATA = []
let types = []
let typesres = []

types_list.forEach(type => {

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

function loadCharacter(id, saved) {

    let data
    if (saved) {
        let findCharacter
        SAVEDATA.forEach(chr => {
            if (chr.id == id) {
                findCharacter = chr
            }
        })
        if (findCharacter) {
            data = findCharacter
        }
    } else {
        data = DATA[id]
    }

    VICNAME.value = data.name
    VICHEALTH.value = data.health
    VICDEF.value = data.defense
    VICDDG.value = data.dodge

    //res
    types_list.forEach(type => {

        document.getElementById(`${type.toLowerCase()}res`).value = data[`${type.toLowerCase()}res`]

    })

    VICID.innerHTML = id

    updateDMGResult()

}

function loadSkill(character, skillid, saved) {

    let chr
    let skill

    if (saved) {
        SAVEDATA.forEach(charrr => {
            if (charrr.id == character) {
                chr = charrr
            }
        })
        chr.skills.forEach(sk => {
            if (sk.id == skillid) {
                skill = sk
            }
        })
    } else {
        chr = DATA[character]
        skill = chr.skills[skillid]
    }

    SKILLNAME.value = skill.name
    BASEDMG.value = skill.basedamage
    ACCURACY.value = skill.accuracy
    REVCOST.value = skill.revs
    COOLDOWN.value = skill.cooldown
    SKILLTYPING.value = skill.spec
    SKILLDESC.value = skill.extra

    types_list.forEach(type => {

        document.getElementById(`${type.toLowerCase()}type`).value = skill[`${type.toLowerCase()}`]

    })

    SKILLID.innerHTML = skillid

    updateDMGResult()

}

function addSkillToUnit() {

    let id = document.getElementById("savingskill").value

    let findCharacter
    SAVEDATA.forEach(chr => {
        if (chr.id == id) {
            findCharacter = chr
        }
    })

    if (findCharacter) {

        let getdate = Date.now()

        findCharacter.skills.push({
            "name": SKILLNAME.value,
            "id": getdate,

            "class": "ATTACK",
            "spec": SKILLTYPING.value,

            "basedamage": BASEDMG.value,
            "accuracy": ACCURACY.value,
            "revs": REVCOST.value,
            "cooldown": COOLDOWN.value,

            "corp": document.getElementById("corptype").value,
            "swge": document.getElementById("swgetype").value,
            "soda": document.getElementById("sodatype").value,
            "absr": document.getElementById("absrtype").value,
            "minm": document.getElementById("minmtype").value,

            "extra": SKILLDESC.value
        })

        document.getElementById(`character-${findCharacter.id}`).click()
        document.getElementById(`saved-skill-${getdate}`).click()

        save()

    }

}

function saveSkillToUnit() {

    let id = document.getElementById("savingskill").value

    let findCharacter
    SAVEDATA.forEach(chr => {
        if (chr.id == id) {
            findCharacter = chr
        }
    })

    if (findCharacter) {

        let findSkill
        findCharacter.skills.forEach(skill => {
            if (skill.id == Number(SKILLID.innerText)) {
                findSkill = skill
            }
        })


        if (findSkill) {

            findSkill.name = SKILLNAME.value

            findSkill.basedamage = BASEDMG.value
            findSkill.accuracy = ACCURACY.value
            findSkill.revs = REVCOST.value
            findSkill.cooldown = COOLDOWN.value
            findSkill.spec = SKILLTYPING.value

            findSkill.corp = document.getElementById("corptype").value
            findSkill.swge = document.getElementById("swgetype").value
            findSkill.soda = document.getElementById("sodatype").value
            findSkill.absr = document.getElementById("absrtype").value
            findSkill.minm = document.getElementById("minmtype").value

            findSkill.extra = SKILLDESC.value

            save()

            document.getElementById(`character-${findCharacter.id}`).click()
            document.getElementById(`saved-skill-${findSkill.id}`).click()

        } else {
            let getdate = Date.now()

            findCharacter.skills.push({
                "name": SKILLNAME.value,
                "id": getdate,

                "class": "ATTACK",
                "spec": SKILLTYPING.value,

                "basedamage": BASEDMG.value,
                "accuracy": ACCURACY.value,
                "revs": REVCOST.value,
                "cooldown": COOLDOWN.value,

                "corp": document.getElementById("corptype").value,
                "swge": document.getElementById("swgetype").value,
                "soda": document.getElementById("sodatype").value,
                "absr": document.getElementById("absrtype").value,
                "minm": document.getElementById("minmtype").value,

                "extra": SKILLDESC.value
            })

            document.getElementById(`character-${findCharacter.id}`).click()
            document.getElementById(`saved-skill-${getdate}`).click()

            save()
        }

    }

}

function removeSavedSkill(cid, sid) {

    let findCharacter
    SAVEDATA.forEach(chr => {
        if (chr.id == cid) {
            findCharacter = chr
        }
    })

    if (findCharacter) {

        let findSkill
        findCharacter.skills.forEach(skill => {
            if (skill.id == sid) {
                findSkill = skill
            }
        })

        if (findSkill) {

            let index = findCharacter.skills.indexOf(findSkill)
            if (index > -1) {
                findCharacter.skills.splice(index, 1)
                save()
                document.getElementById(`character-${findCharacter.id}`).click()
            }

        }

    }

}

function handleCharacter(id, saved) {

    let element = document.getElementById(`character-${id}`)

    if (element.classList.contains("highlighted")) {
        loadCharacter(id, saved)
    }

    document.querySelectorAll(".character").forEach(chr => {
        chr.classList.remove("highlighted")
    })
    element.classList.add("highlighted")

    SKILLS_TABLE.innerHTML = ``

    if (saved) {

        let findCharacter
        SAVEDATA.forEach(chr => {
            if (chr.id == id) {
                findCharacter = chr
            }
        })

        if (findCharacter) {
            findCharacter.skills.forEach(skill => {
                SKILLS_TABLE.innerHTML += `<tr><td><button id="saved-skill-${skill.id}" onclick="loadSkill(${id}, ${skill.id}, ${true})">${skill.name}</button><button onclick="removeSavedSkill(${id}, ${skill.id})" class="removal"><img src="assets/msg_error-0.png"></button></td></tr>`
            })
        }
    } else {
        let skillid = 0
        DATA[id].skills.forEach(skill => {
            SKILLS_TABLE.innerHTML += `<tr><td><button onclick="loadSkill(${id}, ${skillid})">${skill.name}</button></td></tr>`
            skillid++
        })
    }

}

function importSkill() {

    let toTest = IMPORT.value

    if (isJSON(toTest) == true) {

        let skill = JSON.parse(toTest)

        let id = document.getElementById("importoptions").value

        let findCharacter
        SAVEDATA.forEach(chr => {
            if (chr.id == id) {
                findCharacter = chr
            }
        })

        let getdate = Date.now()

        findCharacter.skills.push({
            "name": skill.name,
            "id": getdate,

            "class": skill.class,
            "spec": skill.spec,

            "basedamage": skill.basedamage,
            "accuracy": skill.accuracy,
            "revs": skill.revs,
            "cooldown": skill.cooldown,

            "corp": skill.corp,
            "swge": skill.swge,
            "soda": skill.soda,
            "absr": skill.absr,
            "minm": skill.minm,

            "extra": skill.extra
        })

        IMPORT.value = ""

        document.getElementById(`character-${findCharacter.id}`).click()
        document.getElementById(`saved-skill-${getdate}`).click()

    }

}

function saveunit() {

    let findCharacter
    SAVEDATA.forEach(chr => {
        if (chr.id == Number(VICID.innerText)) {
            findCharacter = chr
        }
    })

    if (findCharacter) {

        findCharacter.name = VICNAME.value

        findCharacter.health = VICHEALTH.value
        findCharacter.defense = VICDEF.value
        findCharacter.dodge = VICDDG.value

        findCharacter.corpres = document.getElementById("corpres").value
        findCharacter.swgeres = document.getElementById("swgeres").value
        findCharacter.sodares = document.getElementById("sodares").value
        findCharacter.absrres = document.getElementById("absrres").value
        findCharacter.minmres = document.getElementById("minmres").value

    } else {
        let getDate = Date.now()
        SAVEDATA.push({

            "name": VICNAME.value,
            "id": getDate,

            "region": "",

            "note": "",
            "behaviour": "",

            "health": VICHEALTH.value,

            "defense": VICDEF.value,
            "dodge": VICDDG.value,

            "attackpower": 1,
            "accmod": 1,
            "critchance": 0.04,

            "corpres": document.getElementById("corpres").value,
            "swgeres": document.getElementById("swgeres").value,
            "sodares": document.getElementById("sodares").value,
            "absrres": document.getElementById("absrres").value,
            "minmres": document.getElementById("minmres").value,

            "skills": []

        })
        loadCharacter(getDate, true)
    }

    save()

    updateTables()

}

function save() {
    localStorage.setItem("mustardskillcreator", JSON.stringify(SAVEDATA));
}
function load() {
    // this parts gonna be the hardest!
    const getSave = localStorage.getItem("mustardskillcreator");

    try {
        if (getSave != null) {
            SAVEDATA = JSON.parse(getSave); // magic things!
            console.log("save loaded")
        } else {
            console.log("no save found")
            save()
            load()
        }

    } catch (e) {
        console.log(e)
    }
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

function updateTables() {

    let options = document.querySelectorAll(".savedoptions")

    options.forEach(element => {

        element.innerHTML = ``

        SAVEDATA.forEach(chr => {
            element.innerHTML += `
            <option value="${chr.id}">${chr.name}</option>
            `
        })

    })

    CHARACTERS_TABLE.innerHTML = ``

    let id = 0
    DATA.forEach(character => {

        CHARACTERS_TABLE.innerHTML += `<tr class="character" onclick="handleCharacter(${id})" id="character-${id}"><td><button>${character.name}</button></td></tr>`

        id++

    });
    
    CHARACTERS_TABLE.innerHTML += `<tr><td class="split"><hr></td></tr>`

    SAVEDATA.forEach(character => {

        CHARACTERS_TABLE.innerHTML += `<tr class="character" onclick="handleCharacter(${character.id}, ${true})" id="character-${character.id}"><td><button>${character.name}</button></td></tr>`

    });

}

axios.get('jsons/characters.json').then(res => {

    DATA = res.data // should be json by default

    load()

    updateTables()

    loadCharacter(0)
    loadSkill(0, 0)

    updateDMGResult()

}).catch(console.error)