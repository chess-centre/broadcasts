const XLSX = require('xlsx')
const workbook = XLSX.readFile(__dirname + '/open-players.xlsx');
const sheet_name_list = workbook.SheetNames;
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const eventName = data[0];
const players = data.slice(4, data.length - 2).map(playerObject);


function playerObject(obj) {
    const values = Object.values(obj)
    const player = {
        "id": values[0],
        "memberId": null,
        "name": obj._1,
        "ratingInfo": {
            "rating": obj._4
        }
    }
    return player;
}

console.log(players);