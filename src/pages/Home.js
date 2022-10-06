import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("storage", () => {
      // When local storage changes, dump the list to
      // the console.
      console.log(
        "myEvent",
        JSON.parse(
          window.localStorage.getItem("ab57f12c-9bdd-40a0-a13e-b3c0ae8c919e")
        )
      );
    });
  }, []);



  //
  return (
    <div className="min-h-screen text-white text-center">
      <div className="grid grid-cols-1 mx-auto gap-8">
        <div className="">
          <img src={logo} className="w-32 mx-auto" alt="Chess Centre" />
          <h4 className="text-teal-brand font-bold text-4xl">
            <span className="text-orange-flyer italic text-3xl">The</span> Chess
            Centre
          </h4>
        </div>
      </div>
      <div className="pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tournament Manager
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Run a very simple chess event.
            </p>
          </div>
        </div>
        <div className="mt-10 pb-12 sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <dl className="rounded-lg bg-gray-800 shadow-inner sm:grid sm:grid-cols-3">
                  <div className="flex flex-col border-b border-gray-700 p-6 text-center sm:border-0 sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-400">
                      Events
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-teal-brand">
                      21
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-b border-gray-700 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-orange-400">
                      In-Progress
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-teal-brand">
                      3
                    </dd>
                  </div>
                  <div className="flex flex-col border-t border-gray-700 p-6 text-center sm:border-0 sm:border-l">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-green-500">
                      Completed
                    </dt>
                    <dd className="order-1 text-5xl font-bold tracking-tight text-teal-brand">
                      4
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={()  => navigate("/create")}
            className="inline-flex items-center rounded-md border border-transparent bg-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Create
          </button>
          <button
            type="button"
            onClick={()  => navigate("/lightning")}
            className="inline-flex items-center rounded-md border border-transparent bg-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Lightning
          </button>
        </div>
      </div>
    </div>
  );
}
