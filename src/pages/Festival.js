import logo from "../assets/logo.png";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
};

const examplePlayer = [
    { name: "Magnus Carlsen", rating: 2865, points: 3, pointsStr: "3½" },
    { name: "Garry Kasparov", rating: 2851, points: 3, pointsStr: "3" },
    { name: "Bobby Fischer", rating: 2761, points: 2.5, pointsStr: "2½" },
    { name: "Vishy Anand", rating: 2801, points: 2, pointsStr: "2" },
    { name: "David Howell", rating: 2680, points: 2, pointsStr: "2" },
]

export default function Home() {
    return (
        <div className="flex px-10">
            <div className="m-auto text-center text-white">
                <img src={logo} className="w-28 mx-auto" alt="Chess Centre" />
                <div className="text-3xl leading-8">
                    <h4 className="text-teal-brand font-bold"><span className="text-orange-flyer">Ilkley</span> Chess Festival</h4>
                </div>
                <div className="grid grid-cols-4 space-x-8 mt-6">
                    <SectionBlock name="Open" bgColor="bg-blue-brand" textColor="text-orange-brand" />
                    <SectionBlock name="Major" bgColor="bg-yellow-brand" textColor="text-blue-brand" />
                    <SectionBlock name="Intermediate" bgColor="bg-orange-brand" textColor="text-blue-brand" />
                    <SectionBlock name="Minor" bgColor="bg-teal-brand" textColor="text-blue-brand" />
                </div>
                <div className="mt-4">
                    <h1 className="text-teal-brand font-bold text-lg leading-10">Leaders</h1>
                </div>
                <div className="grid grid-cols-4 space-x-8">
                    <LeadersBlock players={examplePlayer} />
                    <LeadersBlock players={examplePlayer} />
                    <LeadersBlock players={examplePlayer} />
                    <LeadersBlock players={examplePlayer} />
                </div>
            </div>
        </div>
    );
}

function SectionBlock({ name, textColor, bgColor }) {
    return (
        <div className={classNames("px-5 py-10 rounded-md", bgColor, textColor)}>
            <h1 className="text-4xl font-bold">{name}</h1>
        </div>
    )
}

function LeadersBlock({ players }) {

    const rankColor = (position) => {    
        switch (position) {
            case 1: return "text-yellow-500"   
            case 2: return "text-gray-400" 
            case 3: return "text-amber-700"                 
            default:
                return "text-white"
        }
    }

    return (
        <div className={classNames("px-2 py-6 rounded-lg")}>
            <ol>
                {
                    players.map((player, rank) =>
                    (<li className={classNames("grid grid-cols-12 text-left text-lg border-b text-b border-slate-800 align-top py-2 px-2", rankColor(rank + 1))}>
                        <div>{rank + 1}</div>
                        <div className="col-span-7 text-left">{player.name}</div>
                        <div className="col-span-3">{player.rating}</div>
                        <div>{player.pointsStr}</div>
                    </li>)
                    )
                }
            </ol>
        </div>
    )

}