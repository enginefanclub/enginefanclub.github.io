let apiURL = "https://engine.nefarkitti.dev/efc-backend"
if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    apiURL = "http://localhost:3000"
}

const POLL_CLASSES = ["a", "b", "c", "d", "e", "f", "g"]

const POLL_CONTAINER = document.getElementById("poll-container")

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');

async function init() {
    try {

        let userData = await axios({
            url: `${apiURL}/myself`,
            method: "GET",
            headers: {
                "authorization": localStorage.getItem("efc-usertoken")
            },
            timeout: 5000
        })

        userData = userData.data

        let getIndexParam = parseInt(myParam)

        axios.get(`${apiURL}/getpolls`).then(res => {

            let list = res.data.list

            let poll = list[getIndexParam - 1]

            let parseOptions = JSON.parse(poll.options)
            let parseVotes = JSON.parse(poll.votes)
            let getTotalVotes = 0
            parseVotes.forEach(option => {
                getTotalVotes += option.length
            });

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
                    fill.style.width = `${ getPerc}%`
                }

                bar.appendChild(fill)

                const tallyName = document.createElement("div")
                tallyName.innerText = option
                tallyName.classList.add("tally-item")
                if (parseVotes[i].length >= 1) {
                    tallyName.innerText = `${option} (${getPerc.toFixed(2)}%)`
                }

                const colourBall = document.createElement("div")
                colourBall.classList.add("colourball")
                colourBall.classList.add(POLL_CLASSES[i])

                const tallyInfoHolder = document.createElement("div")
                tallyInfoHolder.classList.add("space-between")

                tallyName.prepend(colourBall)
                tallyInfoHolder.appendChild(tallyName)

                if (!parseVotes[i].includes(parseInt(userData.user_id))) {
                    const voteButton = document.createElement("button")
                    voteButton.innerText = "VOTE"

                    voteButton.onclick = function () {
                        axios({
                            url: `${apiURL}/vote`,
                            method: "POST",
                            headers: {
                                "authorization": localStorage.getItem("efc-usertoken")
                            },
                            data: {
                                pollid: getIndexParam,
                                voting: i,
                            },
                            timeout: 5000
                        }).then(res => {
                            window.location.reload()
                            console.log(res)
                        }).catch(e => {
                            console.error(e);
                            if (e.response && e.response.data) {
                                alert(e.response.data);
                            } else if (e.response) {
                                alert(e.response);
                            }
                        })
                    }

                    tallyInfoHolder.appendChild(voteButton)
                }

                tallyDiv.appendChild(tallyInfoHolder)
            }

            barDiv.appendChild(bar)

            pollDiv.appendChild(barDiv)

            pollDiv.appendChild(tallyDiv)

            POLL_CONTAINER.appendChild(pollDiv)

        })

    } catch (e) {
        console.error(e)
    }
}

init()