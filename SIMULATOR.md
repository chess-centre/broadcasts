# 🎮 Mock & Simulator Guide

Test your chess broadcast platform without physical DGT boards using our comprehensive simulation tools!

---

## 🎯 Quick Start

### Option 1: Live Simulator (Recommended)

Games update in real-time, simulating an actual tournament:

```bash
# Interactive mode (choose settings)
npm run simulate

# Quick start with 4 boards
npm run simulate:quick

# Quick start with custom board count
npm run simulate:quick 8
```

**What happens:**

- Creates multiple games with real player names
- Moves update every 5 seconds (configurable)
- Clocks count down realistically
- Games finish with realistic results
- Perfect for testing live functionality

### Option 2: Static Mock Games

Generate games once without updates (for testing UI only):

```bash
# Generate 4 games
npm run mock

# Generate 8 games
npm run mock 8

# Generate for round 2
npm run mock 6 2

# Clear old data and generate fresh
npm run mock:clear
```

---

## 📖 Detailed Usage

### Live Simulator

#### Interactive Mode

```bash
npm run simulate
```

**Prompts:**

1. **How many boards?** (1-20, default: 4)
2. **Update speed?**
   - 1 = Fast (2s updates)
   - 2 = Normal (5s updates)
   - 3 = Slow (10s updates)
3. **Output directory?** (default: ./Live)

**Features:**

- Real-time move generation
- Realistic clock countdown
- Random game duration (30-70 moves)
- Games finish with 1-0, 0-1, or 1/2-1/2
- Automatic time flagging
- Famous player names and ratings

#### Quick Mode

```bash
# Default: 4 boards, 5s updates
npm run simulate:quick

# Custom board count
npm run simulate:quick 6
```

#### Stopping the Simulator

Press `Ctrl+C` to stop gracefully. You'll see a final summary:

```
📊 Final Summary
Board 1: White wins
  Magnus Carlsen (2882) - Fabiano Caruana (2804)
  Sicilian Defense • 45 moves
...
📈 Results: 2 White wins, 1 Black wins, 1 Draws
```

---

### Static Mock Generator

#### Basic Usage

```bash
# Generate games
npm run mock [boards] [round] [path]
```

**Examples:**

```bash
npm run mock              # 4 boards, round 1, ./Live
npm run mock 8            # 8 boards, round 1
npm run mock 6 2          # 6 boards, round 2
npm run mock 10 1 ./Test  # 10 boards in ./Test directory
```

#### Options

```bash
# Clear existing data first
npm run mock:clear

# Generate ongoing games (result: *)
npm run mock -- --ongoing

# Show help
npm run mock -- --help
```

---

## 🎲 Mock Data Features

### Realistic Players

20 top-rated players with real names and ratings:

- Magnus Carlsen (2882)
- Fabiano Caruana (2804)
- Hikaru Nakamura (2789)
- And 17 more!

### Chess Openings

8 realistic opening repertoires:

- Ruy Lopez
- Sicilian Defense
- Queen's Gambit
- King's Indian Defense
- French Defense
- Caro-Kann Defense
- English Opening
- Italian Game

### Time Controls

Multiple realistic time controls:

- 90 minutes + 30s increment (Classical)
- 45 minutes + 15s increment (Rapid)
- 15 minutes + 5s increment (Blitz)
- And more!

---

## 🧪 Testing Scenarios

### Scenario 1: Small Tournament (4 boards)

```bash
# Terminal 1
npm run simulate:quick

# Terminal 2
npm run server

# Terminal 3
npm start

# Open: http://localhost:3000/live
```

Watch as 4 games progress simultaneously with live leaderboard updates!

### Scenario 2: Large Tournament (10+ boards)

```bash
npm run simulate:quick 12
```

Test how the UI handles many boards. Try different layouts (Grid vs Split).

### Scenario 3: Finished Games

```bash
# Generate completed games
npm run mock 6
```

Test leaderboard calculation without live updates.

### Scenario 4: Mixed Status

```bash
# Generate some finished games
npm run mock 4

# Start simulator for more boards
npm run simulate:quick 4
```

Test UI with both finished and ongoing games (edit board numbers to avoid conflicts).

### Scenario 5: Multiple Rounds

```bash
# Round 1
npm run mock 6 1

# Round 2
npm run mock 6 2

# Update server to watch round 2
# Edit .env or server.js
```

---

## 🎯 Simulator Architecture

### File Structure

```
Live/
└── round-1/
    ├── game-1.pgn  # Board 1
    ├── game-2.pgn  # Board 2
    ├── game-3.pgn  # Board 3
    └── ...
```

### PGN Format

Generated PGNs include:

```
[Event "Live Simulation"]
[White "Magnus Carlsen"]
[Black "Fabiano Caruana"]
[WhiteElo "2882"]
[BlackElo "2804"]
[Result "*"]

1. e4 {[%clk 1:29:45]} e5 {[%clk 1:29:50]} 2. Nf3 {[%clk 1:29:15]} ...
```

Clock times (`[%clk H:MM:SS]`) update realistically with:

- Move time deduction (5-35 seconds per move)
- Time increment addition
- Time flagging when clock reaches 0:00:00

---

## 🔧 Customization

### Modify Player Pool

Edit `server/mock-data.js`:

```javascript
const players = [
  { name: "Your Player", rating: "2500" },
  // Add more players...
];
```

### Change Time Controls

Edit `server/mock-data.js`:

```javascript
const timeControls = [
  { initial: "00:30:00", increment: 10 }, // 30 min + 10s
  // Add more controls...
];
```

### Adjust Update Speed

Edit `server/simulator.js` or pass option:

```javascript
const simulator = new GameSimulator("./Live", {
  updateInterval: 3000, // 3 seconds
});
```

### Custom Output Directory

```bash
# Set in .env
DGT_BASE_PATH=./MyTestGames

# Or pass to simulator
npm run simulate -- ./MyTestGames
```

---

## 🐛 Troubleshooting

### Simulator Not Starting

**Issue:** "Cannot find module"

```bash
# Reinstall dependencies
npm install
```

### Files Not Detected

**Issue:** Server doesn't see new files

1. Check `.env` has correct `DGT_BASE_PATH`
2. Verify files exist: `ls Live/round-1/`
3. Restart server with `npm run server`
4. Check server console for "Watching board N" messages

### Games Not Updating

**Issue:** UI shows old positions

1. Check simulator is running (`npm run simulate` in separate terminal)
2. Verify WebSocket connected (green dot in UI)
3. Check browser console for errors
4. Monitor server console for updates

### Permission Errors

**Issue:** Cannot write to directory

```bash
# Create directory manually
mkdir -p Live/round-1
chmod 755 Live/round-1
```

---

## 💡 Pro Tips

### Development Workflow

```bash
# Terminal 1: Simulator
npm run simulate:quick 6

# Terminal 2: Server
npm run server

# Terminal 3: React App
npm start

# Terminal 4: Available for commands
# (git, file inspection, etc.)
```

### Quick Reset

```bash
# Clear and regenerate
npm run mock:clear
npm run mock 8

# Or manually
rm -rf Live/
npm run simulate:quick
```

### Testing Different States

```bash
# Only ongoing games
npm run mock 4 -- --ongoing

# Only finished games
npm run mock 4
# (finished by default)

# Mix of both (manual)
npm run mock 2
npm run simulate:quick 2
# Adjust board numbers to avoid overlap
```

### Performance Testing

```bash
# Test with many boards
npm run simulate:quick 20

# Fast updates (stress test)
# Edit simulator.js: updateInterval: 1000
npm run simulate
```

---

## 📊 Monitoring Simulation

### Server Console Output

```
⚡ Update 10:30:15 AM
──────────────────────────────────────────────────
  Board 1: Magnus Carlsen vs Fabiano Caruana
    Move 23 • ⏱️  1:15:30 - 1:18:45
  Board 2: Hikaru Nakamura vs Wesley So
    🏁 Game Over: 1-0
...
📊 Status: 2 ongoing, 2 finished
```

### Browser Console

Open DevTools and watch WebSocket messages:

```javascript
// Live game updates
{type: "game_update", board: 1, data: {...}}
```

---

## 🎓 Learning Exercise

Try these challenges:

1. **Modify generation logic** - Add more openings
2. **Create custom scenarios** - Specific player matchups
3. **Extend PGN format** - Add annotations
4. **Build UI controls** - Start/stop simulator from web
5. **Add sound effects** - Play sound on move updates

---

## 🔮 Advanced Usage

### Programmatic Control

```javascript
const GameSimulator = require("./server/simulator");

const sim = new GameSimulator("./Live", {
  round: 1,
  updateInterval: 3000,
});

await sim.initializeGames(8);
await sim.start();

// Later...
sim.stop();
sim.printSummary();
```

### Custom Game Scenarios

```javascript
const PGNGenerator = require("./server/pgn-generator");

const gen = new PGNGenerator("./Live");

// Create specific matchup
const pgn = gen.generatePGN({
  white: { name: "Alice", rating: "2100" },
  black: { name: "Bob", rating: "1950" },
  moves: ["e4", "e5", "Nf3", "Nc6"],
  result: "1/2-1/2",
});

await gen.writeGameFile(1, 1, pgn);
```

---

## 📚 API Reference

### PGNGenerator

```javascript
const gen = new PGNGenerator(basePath);

// Generate random game
gen.generateRandomGame(boardNumber, options);

// Generate multiple games
await gen.generateMultipleGames(count, round, options);

// Clear all data
await gen.clearMockData();
```

### GameSimulator

```javascript
const sim = new GameSimulator(basePath, options);

// Initialize games
await sim.initializeGames(count, options);

// Control simulation
await sim.start();
sim.stop();
sim.printSummary();
```

---

## 🎉 Examples

Check these files for examples:

- [server/mock-data.js](../server/mock-data.js) - Data generation
- [server/pgn-generator.js](../server/pgn-generator.js) - PGN creation
- [server/simulator.js](../server/simulator.js) - Live simulation
- [scripts/generate-mock.js](../scripts/generate-mock.js) - CLI tool

---

**Have fun testing! ♟️**
