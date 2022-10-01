import logo from "../assets/logo.png";
import Chesscom from "../assets/chesscom.png";
import C24 from "../assets/c24.png";

export default function Home() {

  // 
  return (
    <div className="flex flex-1 flex-col justify-between  min-h-screen">
      <div className="mx-auto text-center text-white">

        <div className="">
          <img src={logo} className="w-32 mx-auto" alt="Chess Centre" />
          <h4 className="text-teal-brand font-bold text-4xl"><span className="text-orange-flyer italic text-3xl">The</span> Chess Centre</h4>
        </div>
      </div>
      <div className="py-6 text-center">
        <p className="text-gray-500 text-lg mb-6">Live Game Broadcast</p>
        <div className="grid grid-cols-3 text-center">
          <div></div>
          <div className="flex text-white">
            <img className="w-36 m-auto" src={Chesscom} alt="chess.com" />
            <img className="w-36 m-auto" src={C24} alt="chess24" />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
};

function SectionBlock({ name, textColor, bgColor }) {
  return (
    <div className={classNames("px-5 py-10 rounded-md", bgColor, textColor)}>
      <h1 className="text-4xl font-bold">{name}</h1>
    </div>
  )
}