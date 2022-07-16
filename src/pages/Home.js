import logo from "../assets/logo.png";

export default function Home() {

  return (
    <div className="flex h-screen">
      <div className="m-auto text-center">
        <img src={logo} className="w-52 mx-auto" alt="Chess Centre" />
        <h3 className="text-teal-brand text-2xl font-medium">Broadcasts</h3>
        <h1 className="text-white text-6xl">The Chess Centre</h1>
      </div>
    </div>
  );
}



