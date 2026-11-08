let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}

const POLL_LIST = document.getElementById("poll-list")
const ACTIVE_POLL_LIST = document.getElementById("active-poll-list")

const POLL_CLASSES = ["a", "b", "c", "d", "e", "f", "g"]

axios.get(`${apiURL}/getpolls`).then(res => {

    let list = res.data.list

    console.log(list)

    list.forEach(poll => {

        let parseOptions = JSON.parse(poll.options)
        let parseVotes = JSON.parse(poll.votes)
        let getTotalVotes = 0
        parseVotes.forEach(option => {
            getTotalVotes += option.length
        });

        if (poll.expiry >= Date.now()) {
            const activePoll = document.createElement("a")
            activePoll.href = `/poll/?id=${poll.id}`
            activePoll.style.textDecoration = "none"

            const pollDiv = document.createElement("div")
            pollDiv.classList.add("poll")

            const pollTitle = document.createElement("h3")
            pollTitle.innerText = poll.title
            pollDiv.appendChild(pollTitle)

            const pollExpiry = document.createElement("h5")
            pollExpiry.innerText = moment(poll.expiry).fromNow()
            pollDiv.appendChild(pollExpiry)

            const barDiv = document.createElement("div")
            const bar = document.createElement("div")
            bar.classList.add("bar")

            const tallyDiv = document.createElement("div")
            tallyDiv.classList.add("tally")

            for (let i = 0; i < parseOptions.length; i++) {
                const getPerc = (parseVotes[i].length / getTotalVotes) * 100
                const option = parseOptions[i];
                const fill = document.createElement("div")
                fill.classList.add("fill")
                fill.classList.add(POLL_CLASSES[i])
                fill.innerText = option
                fill.style.display = "none"
                if (parseVotes[i].length >= 1) {
                    fill.style.display = ""
                    fill.style.width = `${getPerc}%`
                }

                bar.appendChild(fill)

                const tallyName = document.createElement("div")
                tallyName.innerText = option
                tallyName.style.display = "none"
                if (parseVotes[i].length >= 1) {
                    tallyName.style.display = ""
                    tallyName.innerText = `${option} (${getPerc}%)`
                }

                const colourBall = document.createElement("div")
                colourBall.classList.add("colourball")
                colourBall.classList.add(POLL_CLASSES[i])
                tallyName.prepend(colourBall)

                tallyDiv.appendChild(tallyName)
            }

            barDiv.appendChild(bar)

            pollDiv.appendChild(barDiv)

            pollDiv.appendChild(tallyDiv)

            pollDiv.innerHTML += `<div class="spacer"></div>`

            activePoll.appendChild(pollDiv)

            ACTIVE_POLL_LIST.appendChild(activePoll)

        } else {
            POLL_LIST.innerHTML += `<a href="/poll/?id=${poll.id}">
                        <div class="article-content">
                            <span class="article-title">${poll.title}</span>
                            <span class="article-timestamp">${moment(poll.expiry).fromNow()}</span>
                        </div>
                    </a>`
        }

    });

})

/*
ACTIVE POLL
<div class="poll">
                        <div class="spacer"></div>
                        <h3>Release Remoria Playtest or Kill Everyone</h3>
                        <h5>in 2 days</h5>
                        <div>
                            <div class="bar">
                                <div class="fill a">release remoria playtest</div>
                                <div class="fill b">kill everyone</div>
                            </div>
                        </div>
                        <div class="tally">
                            <div><div class="colourball a"></div>release remoria playtest (50%)</div>
                            <div><div class="colourball b"></div>kill everyone (50%)</div>
                        </div>
                        <div class="spacer"></div>
                    </div>


*/