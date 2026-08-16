// just a helper to automatically parse timestamps in local time
const timestamp = document.getElementById("timestamp");
timestamp.textContent = moment(timestamp.dataset.timestamp).format("MMMM Do YYYY")
