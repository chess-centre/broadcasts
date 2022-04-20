import logo from "../assets/logo.png";
import ChessGame from "../components/Viewer/Game";

function Games() {
  const round = 1;
  return (
    <div className="bg-slate-900 p-2">
      <div className="grid grid-cols-3">
        <div className="h-screen flex flex-col-reverse p-2">
          <ChessGame round={round} board={2} />
          <ChessGame round={round} board={1} />
        </div>
        <div className="flex flex-col">
          <div className="text-center m-auto -mb-20 mt-10">
            <img src={logo} className="w-52" alt="Chess Centre" />
            <h2 className=" text-3xl text-brand-cyan">Rapidplay</h2>
          </div>  
          <ChessGame round={round} board={1} />
        </div>
        <div className="h-screen flex flex-col-reverse p-2">
          <ChessGame round={round} board={2} />
          <ChessGame round={round} board={1} />
        </div>
      </div>
    </div>
  );
}

export default Games;



