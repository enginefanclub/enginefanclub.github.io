function playSoundEffect(url, t = 0) {

    let sound = document.createElement("audio")
    sound.src = url
    sound.setAttribute("playsinline", "")
    document.body.appendChild(sound)

    sound.onloadedmetadata = function () {
        sound.play()
        let dura = sound.duration * 1000
        if (t>=1) dura = t;
        setTimeout(() => {
            sound.remove()
        }, dura);
    };

}