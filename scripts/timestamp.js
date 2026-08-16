// just a helper to automatically parse timestamps in local time

const timestamps = document.querySelectorAll('#timestamp');

timestamps.forEach(timestamp => {
    timestamp.textContent = moment(parseInt(timestamp.dataset.timestamp)).format("MMMM Do YYYY")
})
