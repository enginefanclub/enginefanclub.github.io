
function addzero(num) {

    if (num.toString().length <= 1) {
        return "0" + num.toString()
    } else {
        return num.toString()
    }

}

function countdown(to, elm) {

    let now = Date.now()

    let diff = to - now

    if (diff <= 0) return elm.innerText = `NOW!`;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elm.innerText = `${addzero(days)}:${addzero(hours)}:${addzero(minutes)}:${addzero(seconds)}`

    setTimeout(() => {
        return countdown(to, elm)
    }, 1000);

}