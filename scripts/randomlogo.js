const logo = document.getElementById("EFCLOGO")

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

logo.src = `assets/logos/logo${getRandomInt(16) + 1}.png`