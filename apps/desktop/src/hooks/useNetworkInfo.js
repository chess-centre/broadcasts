import { useState, useEffect } from "react";
import { getServerURL } from "../utils/server-url";

const API = getServerURL();

/**
 * Hook that fetches the real LAN-reachable broadcast URLs from the server.
 * Falls back to the current window location if the server doesn't respond.
 */
export default function useNetworkInfo() {
  const [info, setInfo] = useState({
    lanIP: null,
    serverURL: null,
    spectatorURL: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/api/config`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.network) {
          setInfo({
            lanIP: data.network.lanIP,
            serverURL: data.network.serverURL,
            spectatorURL: data.network.spectatorURL,
            loading: false,
          });
        } else {
          setInfo((prev) => ({ ...prev, loading: false }));
        }
      })
      .catch(() => {
        if (!cancelled) setInfo((prev) => ({ ...prev, loading: false }));
      });
    return () => { cancelled = true; };
  }, []);

  // Build the best URL for spectators
  const getBroadcastURL = (path = "/live") => {
    if (info.serverURL) return `${info.serverURL}${path}`;
    return `${window.location.protocol}//${window.location.host}${path}`;
  };

  return { ...info, getBroadcastURL };
}
