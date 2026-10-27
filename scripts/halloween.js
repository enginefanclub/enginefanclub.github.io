//stop peeking
const TIMER_SPAN = document.getElementById("hw-timer")


function updateTime() {
    TIMER_SPAN.innerText = moment(1793404801000).fromNow();
    setTimeout(() => {
        return updateTime()
    }, 1000);
}

updateTime()