import ChessGame from "../components/Viewer/Game";

function Games() {
  const round = 1;
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        <ChessGame round={round} board={1} />
        <ChessGame round={round} board={2} />
      </div>
    </div>
  );
}

export default Games;
