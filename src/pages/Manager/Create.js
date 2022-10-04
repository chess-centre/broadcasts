import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Create() {

  const navigate = useNavigate();
  const [eventJson, setEvent] = useState({});

  const updateEvent = () => {
    const ev = JSON.parse(eventJson);
    if(ev && ev.eventId) {
      window.localStorage.setItem(ev.eventId, JSON.stringify(ev));
      navigate(`/update/${ev.eventId}`);
    } else {
      console.log("No Event ID");
    }
  }

  useEffect(() => { }, []);
  //
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="min-h-screen text-white text-center">
        <div className="mt-5 md:col-span-2 md:mt-0">
          <div>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    Create Event
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="event"
                      name="event"
                      rows={3}
                      onChange={(e) => setEvent(e.target.value)}
                      className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                      defaultValue={''}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  onClick={() => updateEvent()}
                  className="inline-flex justify-center rounded-md border border-transparent bg-slate-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
