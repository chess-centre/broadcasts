# 🛠️ Development Guide

Guide for developers who want to customize and extend the Chess Broadcast Platform.

## 📁 Project Structure

```
broadcasts/
├── server/                     # Backend Node.js server
│   ├── server.js              # Main WebSocket server
│   ├── parse-game.js          # PGN parser with clock extraction
│   └── config.js              # Configuration management
├── src/
│   ├── hooks/                 # Custom React hooks
│   │   ├── usePgn.js         # WebSocket game data hook
│   │   ├── useDGT.js         # Direct DGT API hook (experimental)
│   │   └── useInterval.js    # Polling helper
│   ├── components/
│   │   ├── Board/            # Chessboard display components
│   │   ├── Viewer/           # Game viewer components
│   │   ├── Shared/           # Reusable components
│   │   │   ├── LiveLeaderboard.js  # Real-time standings
│   │   │   ├── Standings.js        # Static standings
│   │   │   └── ...
│   │   └── Swiss/            # Tournament system components
│   └── pages/                # Route pages
│       ├── LiveBroadcast.js  # Main live broadcast page
│       ├── Games.js          # Multi-board viewer
│       └── ...
├── .env                      # Environment configuration
└── package.json             # Dependencies
```

---

## 🎨 Customizing the UI

### Change Board Appearance

Edit [`src/components/Board/Board.js`](src/components/Board/Board.js):

```javascript
// Change board size
<div className="h-96 w-96 text-center items-center m-auto">

// Change color scheme (replace "orange-500" with your color)
<div className="bg-orange-500">

// Change board theme (brown, blue, green, etc.)
import "chessground/assets/chessground.blue.css";
```

Available themes:

- `chessground.brown.css` (default)
- `chessground.blue.css`
- `chessground.green.css`
- `chessground.purple.css`

### Customize Leaderboard

Edit [`src/components/Shared/LiveLeaderboard.js`](src/components/Shared/LiveLeaderboard.js):

```javascript
// Hide ratings column
<LiveLeaderboard showRatings={false} />;

// Change sort order
const sortedStandings = Array.from(playerScores.values()).sort((a, b) => {
  // Custom sorting logic here
});

// Add custom columns
<th>Your Column</th>;
```

### Modify Layout Options

Edit [`src/pages/LiveBroadcast.js`](src/pages/LiveBroadcast.js):

```javascript
// Add new layout option
const [layout, setLayout] = useState("grid"); // grid, split, list, focus

// Customize grid columns
<div className="grid xl:grid-cols-3 2xl:grid-cols-4">
  // Change to grid-cols-2, grid-cols-5, etc.
</div>;
```

---

## 🔌 Extending WebSocket Messages

### Add New Message Types (Server)

Edit [`server/server.js`](server/server.js):

```javascript
function handleClientMessage(ws, data) {
  switch (data.type) {
    case "your_new_type":
      // Handle new message type
      ws.send(
        JSON.stringify({
          type: "response_type",
          data: yourData,
        }),
      );
      break;
  }
}
```

### Handle New Messages (Client)

Edit [`src/hooks/usePgn.js`](src/hooks/usePgn.js):

```javascript
const handleMessage = (message) => {
  switch (message.type) {
    case "your_response_type":
      // Handle server response
      console.log(message.data);
      break;
  }
};
```

---

## 🎯 Creating Custom Components

### Example: Custom Board Display

Create `src/components/Custom/MyBoard.js`:

```javascript
import { usePGN } from "../../hooks/usePgn";
import BoardWrapper from "../Board/Board";

export default function MyBoard({ boardNumber }) {
  const { games } = usePGN();
  const game = games.get(boardNumber);

  if (!game) return <div>Loading...</div>;

  return (
    <div className="custom-wrapper">
      <h2>
        {game.whiteInfo.name} vs {game.blackInfo.name}
      </h2>
      <BoardWrapper
        name={boardNumber.toString()}
        fen={game.fen}
        info={{ whiteInfo: game.whiteInfo, blackInfo: game.blackInfo }}
        result={game.gameResult}
        // ... other props
      />
    </div>
  );
}
```

### Example: Custom Stats Widget

Create `src/components/Custom/StatsWidget.js`:

```javascript
import { usePGN } from "../../hooks/usePgn";

export default function StatsWidget() {
  const { games, active } = usePGN();

  const ongoing = Array.from(games.values()).filter(
    (g) => g.status === "ongoing",
  ).length;
  const finished = Array.from(games.values()).filter(
    (g) => g.status === "finished",
  ).length;

  return (
    <div className="stats-widget">
      <h3>Tournament Stats</h3>
      <p>Active: {ongoing}</p>
      <p>Finished: {finished}</p>
      <p>Status: {active ? "Live" : "Offline"}</p>
    </div>
  );
}
```

---

## 🧪 Testing

### Manual Testing Without DGT Boards

Create test PGN files in `Live/round-1/`:

```bash
# game-1.pgn
[Event "Test"]
[White "Alice"]
[Black "Bob"]
[WhiteElo "2100"]
[BlackElo "1950"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 1-0


# game-2.pgn
[Event "Test"]
[White "Carol"]
[Black "Dave"]
[WhiteElo "2000"]
[BlackElo "2050"]
[Result "1/2-1/2"]

1. d4 d5 2. c4 e6 1/2-1/2
```

Watch them appear in real-time!

### Simulating Live Updates

```bash
# Append moves to existing PGN to trigger updates
echo "3. Bc4" >> Live/round-1/game-1.pgn
```

---

## 🚀 Performance Optimization

### Reduce Re-renders

Use `React.memo` for board components:

```javascript
import { memo } from "react";

const BoardWrapper = memo(({ fen, ...props }) => {
  // Component code
});

export default BoardWrapper;
```

### Optimize WebSocket Messages

Limit update frequency on server:

```javascript
// Add debouncing
let updateTimeout;
watcher.on("change", async () => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(async () => {
    await broadcastGameUpdate(round, boardNumber, filePath);
  }, 200); // Wait 200ms before broadcasting
});
```

---

## 🔐 Production Deployment

### Environment Variables

Update `.env` for production:

```bash
PORT=8080
CORS_ORIGIN=https://yourdomain.com
DEBUG=false
```

### Nginx Proxy Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # WebSocket proxy
    location /games {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # React app
    location / {
        root /var/www/broadcasts/build;
        try_files $uri /index.html;
    }
}
```

### Build for Production

```bash
# Build React app
npm run build

# Run server with PM2
npm install -g pm2
pm2 start server/server.js --name chess-broadcast
pm2 save
pm2 startup
```

---

## 🐛 Debugging

### Enable Debug Mode

```bash
# In .env
DEBUG=true
```

### View WebSocket Messages

In browser console:

```javascript
// Monitor connection
const ws = new WebSocket("ws://localhost:8080/games");
ws.onmessage = (msg) => console.log(JSON.parse(msg.data));
```

### Server Logs

```bash
# View server output
npm run server

# With detailed logging
DEBUG=true npm run server
```

### Check File Watcher

```javascript
// Add to server.js
watcher.on("add", (path) => console.log("Added:", path));
watcher.on("change", (path) => console.log("Changed:", path));
watcher.on("unlink", (path) => console.log("Removed:", path));
```

---

## 📚 API Reference

### `usePGN()` Hook

```javascript
const {
  active, // boolean - WebSocket connection status
  gameState, // object - Current game state (if boardNumber specified)
  games, // Map<number, gameData> - All games
  subscribeToRound, // function(round) - Subscribe to specific round
  close, // function() - Close WebSocket connection
} = usePGN(boardNumber); // optional: specific board number
```

### Game Data Object

```javascript
{
  whiteInfo: { name: string, rating: string },
  blackInfo: { name: string, rating: string },
  whiteClock: string,  // "HH:MM:SS"
  blackClock: string,  // "HH:MM:SS"
  gameResult: string,  // "*", "1-0", "0-1", "1/2-1/2"
  pgn: string,
  status: string,      // "ongoing", "finished", "error"
  moveCount: number,
  currentMove: number,
  event: string,
  round: string,
  date: string
}
```

---

## 🤝 Contributing

### Adding New Features

1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Style

- Use ES6+ features
- Follow existing naming conventions
- Add JSDoc comments for functions
- Use Tailwind CSS for styling

---

## 📞 Common Development Tasks

### Add New Route

1. Create page component in `src/pages/`
2. Add route to `src/routes.js`:
   ```javascript
   {
     path: "/your-route",
     element: lazy(() => import("./pages/YourPage")),
   }
   ```

### Change Server Port

Update `.env`:

```bash
PORT=3001
```

Update client in `src/hooks/usePgn.js`:

```javascript
const URL = "ws://localhost:3001/games";
```

### Add New Tournament Format

1. Create component in `src/components/YourFormat/`
2. Create page in `src/pages/YourFormat.js`
3. Add route
4. Implement pairing/standings logic

---

**Happy Coding! ♟️**
