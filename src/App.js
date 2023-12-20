import Router from "./routes/Router";
import { useEffect } from "react";
import Echo from "laravel-echo";

function App() {
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "b97c818f3ea7eb3a15fe",
    wsHost: "localhost",
    wsPort: 6001,
    transports: ["websocket"],
    enabledTransports: ["ws", "wss"],
    forceTLS: false,
    disableStats: true,
  });

  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
