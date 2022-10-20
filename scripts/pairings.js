const XLSX = require("xlsx");
const workbook = XLSX.readFile(__dirname + "/open-pairings-r1.xlsx");
const sheet_name_list = workbook.SheetNames;
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
const pairings = data.slice(5, data.length - 2).map(pairingObject);
const scores = data.slice(5, data.length - 2).map(scoringObject);

function pairingObject(obj) {
  if (obj._10) return [obj[""], obj._10];
  return [obj[""], "not paired"];
}

function scoringObject(obj) {

  const score = obj._5;

  if (score === "1 - 0" || score === "+ - -") {
    return [1, 0];
  }

  if (score === "0 - 1" || score === "- - +") {
    return [0, 1];
  }

  if (score === "½ - ½") {
    return [0.5, 0.5];
  }

  if (score === "½") {
    return [0.5, null];
  }

  if (score === 0) {

    return [0, null];
  }
}


console.log("============= PAIRINGS =================");
console.log(JSON.stringify(pairings));
console.log("========================================");

console.log("============= SCORES =================");
console.log(JSON.stringify(scores));
console.log("========================================");