
function award(id, page) {

    axios({
        url: `http://engine.nefarkitti.dev/efc-backend/grant`,
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("efc-usertoken")
        },
        data: {
            id: id,
            type: "trophy",
            visited: page,
        },
        timeout: 5000
    }).then(res => {
        
        // ill make a proper display l8r even though we have 24 HOURS LEFT TO DO ALL OF THIS FUCK FUCK FUCK FUCK FUUUUUCK
        console.log(res)
    })

}