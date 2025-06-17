const values = {
    "ZAYIN": 5,
    "TETH": 4,
    "HE": 3,
    "WAW": 2,
    "ALEPH": 1
}

axios.get('jsons/abnormalities.json').then(res => {
    let jsonData = res.data // should be json by default

    const abnotable = document.getElementById("abnotable")

    jsonData.sort(function(a,b) {
        return values[b.risk] - values[a.risk]
    });

    var count = 0

    jsonData.forEach(abnormality => {
        
        count += 1

        abnotable.innerHTML += `
        
        <tr class="abno-row" onclick="loadabno('${abnormality.id}')">
            <td class="abnotablecount">${count}</td>
            <td><img src="${abnormality.icon}"></td>
            <td><b>${abnormality.name}</b></td>
            <td>${abnormality.id}</td>
            <td class="risklevel"><span class="${abnormality.risk}">${abnormality.risk}</span></td>
        </tr>

        `

    });

}).catch(console.error)