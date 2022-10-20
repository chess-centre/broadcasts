const XLSX = require("xlsx");
const workbook = XLSX.readFile(__dirname + "/minor-players.xlsx");
const sheet_name_list = workbook.SheetNames;
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
const adminData = require("./admin-festival-data.json");
const players = data.slice(4, data.length - 2).map(playerObject);
const adminPlayers = adminData.players[3].entries;

function playerObject(obj) {
  const values = Object.values(obj);
  const names = obj._1.split(" ");
  const matchName = `${names[1]} ${names[0]}`;

  const player = {
    id: values[0],
    memberId: null,
    name: obj._1,
    matchName: matchName,
    ratingInfo: {
      eventRating: obj._4,
    },
  };
  return player;
}

const updates = [];

for (let index = 0; index < adminPlayers.length; index++) {
  const element = adminPlayers[index];

  const chessResultsPlayer = players.find(
    (p) => p.id === element.chessResulsSeed
  );

  if (chessResultsPlayer) {
    updates.push({
      ...element,
      crName: chessResultsPlayer.name,
      ratingInfo: {
        ...element.ratingInfo,
        eventRating: chessResultsPlayer.ratingInfo.eventRating,
      },
    });
  }
}

const sorted = updates.sort((a, b) => a.chessResulsSeed - b.chessResulsSeed);

console.log(sorted);

console.log(JSON.stringify(sorted));
