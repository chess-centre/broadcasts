import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const navigate = useNavigate();
  const [eventJson, setEvent] = useState({});

  const updateEvent = () => {
    try {
      const ev = JSON.parse(eventJson);
      if (ev && ev.eventId) {
        window.localStorage.setItem(ev.eventId, JSON.stringify(ev));
        navigate(`/update/${ev.eventId}`);
      } else {
        console.log("No Event ID");
      }
    } catch (error) {
      console.log("cannot parse object");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-lg font-semibold text-gh-text mb-4">Create Event</h1>
      <div className="bg-gh-surface border border-gh-border rounded-lg overflow-hidden">
        <div className="p-4 space-y-3">
          <label className="block text-sm text-gh-textMuted">
            Paste event JSON
          </label>
          <textarea
            id="event"
            name="event"
            rows={6}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full bg-gh-bg border border-gh-border text-gh-text rounded-md px-3 py-2 text-sm focus:border-gh-link focus:ring-1 focus:ring-gh-link"
          />
        </div>
        <div className="border-t border-gh-border px-4 py-3 flex justify-end">
          <button
            onClick={() => updateEvent()}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gh-btnPrimary rounded-md border border-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-green-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
