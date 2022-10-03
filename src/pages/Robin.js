import RoundRobin from "../components/RoundRobin/RoundRobin";
import data from "../components/RoundRobin/meta-test.json";
import Logo from "../assets/logo.png";

const { name, players, results, settings } = data;

const Viewer = () => {
  const isLastRound = settings.currentRound >= settings.totalRounds;
  const showRoundTimeForRound = settings.showRoundTimeForRound;
  const isLive = settings.roundLive;

  return (
    <div className="bg-cool-gray-900 h-full px-5 pt-4 pb-10">
      <div className="text-center">
        <div className="sm:relative bg-cool-gray-900 py-4 border-2 border-teal-600 shadow-lg rounded-lg mb-4">
          <div className="sm:absolute text-center">
            <img src={Logo} alt="chess centre" className="h-20 sm:ml-2 sm:-mt-2 text-center mx-auto" />
          </div>
          <h2 className="sm:tracking-tight text-white sm:text-teal-500 text-lg font-semibold sm:text-3xl sm:leading-10 sm:font-bold">
            {name}
          </h2>
          <div className="hidden sm:block sm:tracking-tight text-gray-100 text-md sm:leading-none mt-3">
            Welcome to the 1st dedicated, not for profit, chess centre in the UK
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3">
          {players.map(({ entries, section, title, icon }, index) => {
            const scores = results.find((r) => r.section === section).scores;
            return (
              <RoundRobin
                key={index}
                title={title}
                entries={entries}
                results={scores}
                settings={settings}
                icon={icon}
                boards={index}
              />
            );
          })}
        </div>

        <div className="hidden sm:grid grid-cols-1 mt-4">
          <div className="bg-cool-gray-500 border-cool-gray-500">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-2xl">
                  Event Information
                </h2>
              </div>
              <dl className="mt-2 text-center sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-20">
                <div className="flex flex-col -mt-6">
                  {showRoundTimeForRound && (
                    <>
                      <dt className="order-1 mt-2 text-lg leading-6 font-medium text-gray-400">
                        Next Round
                      </dt>
                      <dd className="order-2 text-5xl font-extrabold text-white">
                        {settings.nextRoundTime[showRoundTimeForRound]}
                      </dd>
                    </>
                  )}
                  {!isLastRound && !isLive && !showRoundTimeForRound && (
                    <>
                      <dt className="order-1 mt-2 text-lg leading-6 font-medium text-gray-400">
                        Next Round
                      </dt>
                      <dd className="order-2 text-5xl font-extrabold text-white">
                        {settings.nextRoundTime[settings.currentRound]}
                      </dd>
                    </>
                  )}
                  {!isLastRound && isLive && !showRoundTimeForRound && (
                    <>
                      <dt className="order-1 mt-2 text-lg leading-6 font-medium text-gray-400">
                        Next Round
                      </dt>
                      <dd className="order-2 text-5xl font-extrabold text-white">
                        {settings.nextRoundTime[settings.currentRound + 1]}
                      </dd>
                    </>
                  )}
                  {isLastRound && isLive && !showRoundTimeForRound && (
                    <>
                      <dt className="order-1 mt-2 text-lg leading-6 font-medium text-gray-400">
                        Last Round
                      </dt>
                      <dd className="order-2 text-3xl font-extrabold text-orange-brand">
                        Underway
                      </dd>
                    </>
                  )}
                  {isLastRound && !isLive && !showRoundTimeForRound && (
                    <>
                      <dt className="order-1 mt-2 text-lg leading-6 font-medium text-gray-400">
                        Last Round
                      </dt>
                      <dd className="order-2 text-3xl font-extrabold text-gray-600">
                        Complete
                      </dd>
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  <dt className="order-1 mt-2 text-lg leading-6 font-medium text-gray-400">
                    Live Games
                  </dt>
                  <dd className="order-2 text-2xl font-extrabold text-teal-600 mt-1">
                    chesscentre.online
                  </dd>
                </div>
                <div className="flex flex-col -mt-6">
                  <dt className="order-1 mt-2 text-lg leading-6 font-medium text-gray-400">
                    Prize Giving
                  </dt>
                  <dd className="order-2 text-5xl font-extrabold text-white">
                    {settings.prizeGiving}{" "}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
