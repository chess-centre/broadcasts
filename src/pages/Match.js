import RoundRobin from "../components/RoundRobin/RoundRobin";
import data from "../components/RoundRobin/meta-test.json";
import Logo from "../assets/logo.png";
import { MatchTable } from "../components/Shared/MatchTable";

const match = {
    homeTeam: {
        name: "Ilkley Dragons"
    },
    awayTeam: {
        name: "	Hull DCA B"
    },
    boards: [
        { board: 1, black: "Matthew D Webb", white: "", result: "" },
        { board: 2, white: "James Hall", black: "", result: "" },
        { board: 3, black: "Yassine Abbazi", white: "", result: "" },
        { board: 4, white: "Andy Mata", black: "", result: "" },
        { board: 5, black: "Gawain Ako", white: "", result: "" },
        { board: 6, white: "Gary Corcoran", black: "", result: "" },
        { board: 7, black: "Olegs K Kungurovs", white: "", result: "" },
        { board: 8, white: "Paul Butterworth", black: "", result: "" }
    ]
}

export const HomeTeam = [
    {
        id: 1,
        name: "Matthew D Webb",
        rating: 2545,
    },
    {
        id: 2,
        name: "James Hall",
        rating: 1873,
    },
    {
        id: 3,
        name: "Yassine Abbazi",
        rating: 1872,
    },
    {
        id: 4,
        name: "Andy Mata",
        rating: 1853,
    },
    {
        id: 5,
        name: "Gawain Ako",
        rating: 1787,
    },
    {
        id: 6,
        name: "Gary Corcoran",
        rating: 1767,
    },
    {
        id: 7,
        name: "Olegs K Kungurovs",
        rating: 1751,
    },
    {
        id: 8,
        name: "Paul Butterworth",
        rating: 1729,
    }
];

export const AwayTeam = [
    {
        id: 1,
        name: "David W Stephenson",
        rating: 1867,
    },
    {
        id: 2,
        name: "Andrew D Bettley",
        rating: 1803,
    },
    {
        id: 3,
        name: "Bryan Hesler",
        rating: 1751,
    },
    {
        id: 4,
        name: "Michael Pollard",
        rating: 1657,
    },
    {
        id: 5,
        name: "Peter T Perkins",
        rating: 1649,
    },
    {
        id: 6,
        name: "R Malcolm Hara",
        rating: 1659,
    },
    {
        id: 7,
        name: "William J Egan",
        rating: 1591,
    },
    {
        id: 8,
        name: "Stuard Sharp",
        rating: 1392,
    }
];


const results = [
    {
        round: 1,
        pairResults: [[0.5,0.5], [1,0], [1,0], [1,0], [0.5,0.5], [1,0], [0.5,0.5], [1,0], [], [], [], [], [1,0]],
    }
];

const players =
{
    homeTeam: { players:  HomeTeam }, 
    awayTeam: { players: AwayTeam }
};

// teams,
// results,
// round,
// whiteOnOdd,
// showRating = true,
// isLive = true,

const Viewer = () => {

  return (
    <div className="bg-cool-gray-900 h-full px-5 pt-4 pb-10">
      <div className="text-center">
        <div className="sm:relative bg-cool-gray-900 py-4 border-2 border-teal-600 shadow-lg rounded-lg mb-4">
          <div className="sm:absolute text-center">
            <img src={Logo} alt="chess centre" className="h-20 sm:ml-2 sm:-mt-2 text-center mx-auto" />
          </div>
          <h2 className="sm:tracking-tight text-white sm:text-teal-500 text-lg font-semibold sm:text-3xl sm:leading-10 sm:font-bold">
            YCA IM Brown Sheild
          </h2>
          <div className="hidden sm:block sm:tracking-tight text-gray-100 text-md sm:leading-none mt-3">
            The Chess Centre welcomes Hull DCA B
          </div>
        </div>

        <div className="grid grid-cols-1">
            <MatchTable teams={players} results={results} round={1} whiteOnOdd={false} isLive={true} />
        </div>


      </div>
    </div>
  );
};

export default Viewer;
