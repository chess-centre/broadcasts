const { useEffect } = require("react");


const wharfedalePlayers = [
  // Mountain Lions
  {
    id: 1,
    firstName: "Shriaansh",
    lastName: "Ganti",
    middleName: "",
    teamId: 1,
  },
  {
    id: 2,
    firstName: "Cora",
    lastName: "Wainwright",
    middleName: "",
    teamId: 1,
  },
  {
    id: 3,
    firstName: "Edward",
    lastName: "Freeman",
    middleName: "",
    teamId: 1,
  },
  {
    id: 4,
    firstName: "Alex",
    lastName: "Rawse",
    middleName: "",
    teamId: 1,
  },
  // Night Hawks
  {
    id: 5,
    firstName: "Caelan",
    lastName: "Batty",
    middleName: "",
    teamId: 2,
  },
  {
    id: 6,
    firstName: "Freya",
    lastName: "Bramall",
    middleName: "",
    teamId: 2,
  },
  {
    id: 7,
    firstName: "Kira",
    lastName: "Kapustina",
    middleName: "",
    teamId: 2,
  },
  {
    id: 8,
    firstName: "Heidi",
    lastName: "Emery",
    middleName: "",
    teamId: 2,
  },
  {
    id: 9,
    firstName: "Jacob",
    lastName: "Robinson",
    middleName: "",
    teamId: 2,
  },
  // Leopards
  {
    id: 10,
    firstName: "Pierre",
    lastName: "De Beco",
    middleName: "",
    teamId: 3,
  },
  {
    id: 11,
    firstName: "Lois",
    lastName: "Northage",
    middleName: "",
    teamId: 3,
  },
  {
    id: 12,
    firstName: "Leo",
    lastName: "Logan",
    middleName: "",
    teamId: 3,
  },
  {
    id: 13,
    firstName: "George",
    lastName: "Sparrow",
    middleName: "",
    teamId: 3,
  },
  {
    id: 14,
    firstName: "Dylan",
    lastName: "Parkinson",
    middleName: "",
    teamId: 3,
  },
  //Orangutans
  {
    id: 15,
    firstName: "Charlie",
    lastName: "Wainwright",
    middleName: "",
    teamId: 4,
  },
  {
    id: 16,
    firstName: "Dan",
    lastName: "Yoshino-Buntin",
    middleName: "",
    teamId: 4,
  },
  {
    id: 17,
    firstName: "Archie",
    lastName: "Sheen",
    middleName: "",
    teamId: 4,
  },
  {
    id: 18,
    firstName: "Ella",
    lastName: "Bradford",
    middleName: "",
    teamId: 4,
  },
];

const playerRatings = [
  // Mountain Lions
  {
    type: Federation.ECF,
    rating: 1154,
    playerId: 1
  },
  {
    type: Federation.ECF,
    rating: 906,
    playerId: 2
  },
  {
    type: Federation.ECF,
    rating: 792,
    playerId: 3
  },
  {
    type: Federation.ECF,
    rating: 507,
    playerId: 4
  },
  // Night Hawks
  {
    type: Federation.ECF,
    rating: 728,
    playerId: 5
  },
  {
    type: Federation.ECF,
    rating: 749,
    playerId: 6
  },
  {
    type: Federation.ECF,
    rating: 702,
    playerId: 7
  },
  {
    type: Federation.ECF,
    rating: 397,
    playerId: 8
  },
  {
    type: Federation.ECF,
    rating: 228,
    playerId: 9
  },
  // Leopards
  {
    type: Federation.ECF,
    rating: 1527,
    playerId: 10
  },
  {
    type: Federation.ECF,
    rating: 1306,
    playerId: 11
  },
  {
    type: Federation.ECF,
    rating: 1178,
    playerId: 12
  },
  {
    type: Federation.ECF,
    rating: 1223,
    playerId: 13
  },
  {
    type: Federation.ECF,
    rating: 742,
    playerId: 14
  },
  // Orangutans
  {
    type: Federation.ECF,
    rating: 1188,
    playerId: 15
  },
  {
    type: Federation.ECF,
    rating: 1088,
    playerId: 16
  },
  {
    type: Federation.ECF,
    rating: 669,
    playerId: 17
  },
  {
    type: Federation.ECF,
    rating: 369,
    playerId: 18
  }
]

const wharfedaleTeams = [
  {
    id: 1,
    name: "Mountain Lions",
    divisionId: 1,
  },
  {
    id: 2,
    name: "Night Hawks",
    divisionId: 1,
  },
  {
    id: 3,
    name: "Leopards",
    divisionId: 1,
  },
  {
    id: 4,
    name: "Orangutans",
    divisionId: 1,
  }
]
const teams = wharfedaleTeams.map(async (team) => await prisma.playerRating.create({ data: team })):


const wharfedaleFixtures = [
  {
    id: 1,
    date: `2022-09-24T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 1
  },
  {
    id: 2,
    date: `2022-09-24T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 4
  },
  {
    id: 3,
    date: `2022-10-08T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 1,
    awayTeamId: 4
  },
  {
    id: 4,
    date: `2022-10-08T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 2
  },
  {
    id: 5,
    date: `2022-11-12T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 1
  },
  {
    id: 6,
    date: `2022-11-12T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 4,
    awayTeamId: 3
  },
  {
    id: 7,
    date: `2022-12-10T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 1
  },
  {
    id: 8,
    date: `2022-12-10T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 4
  },
  {
    id: 9,
    date: `2023-01-28T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 1,
    awayTeamId: 4
  },
  {
    id: 10,
    date: `2023-01-28T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 2
  },
  {
    id: 11,
    date: `2023-02-18T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 1
  },
  {
    id: 12,
    date: `2023-02-18T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 4,
    awayTeamId: 3
  }
];


const wharfedaleResults = [
  {
    id: 1,
    fixtureId: 1
  },
  {
    id: 2,
    fixtureId: 2
  },
  {
    id: 3,
    fixtureId: 3
  },
  {
    id: 4,
    fixtureId: 4
  }
];

// 

const updatedFixtures  = [{
  id: 1,
  date: `2022-09-24T10:30:00.000Z`,
  seasonId: 1,
  divisionId: 1,
  homeTeamId: 3,
  awayTeamId: 1,
  // added:
  
},
{
  id: 2,
  date: `2022-09-24T10:30:00.000Z`,
  seasonId: 1,
  divisionId: 1,
  homeTeamId: 2,
  awayTeamId: 4
},
{
  id: 3,
  date: `2022-10-08T10:30:00.000Z`,
  seasonId: 1,
  divisionId: 1,
  homeTeamId: 1,
  awayTeamId: 4
},
{
  id: 4,
  date: `2022-10-08T10:30:00.000Z`,
  seasonId: 1,
  divisionId: 1,
  homeTeamId: 3,
  awayTeamId: 2
}]