# 🚀 Quick Setup Guide

Get your DGT chess broadcast up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
# On macOS/Linux:
nano .env

# On Windows:
notepad .env
```

**Important:** Update `DGT_BASE_PATH` to match your DGT LiveChess output directory.

Example paths:

- **Windows:** `C:/Users/YourName/Desktop/Live`
- **macOS:** `/Users/YourName/Desktop/Live`
- **Linux:** `/home/yourname/Desktop/Live`

## Step 3: Prepare DGT LiveChess

### 3.1 Install DGT LiveChess

Download from: https://www.livechess.com/

### 3.2 Configure PGN Output

1. Open DGT LiveChess
2. Go to **Settings** → **File Output**
3. Check ✅ **"Save PGN files"**
4. Set your output directory (must match `.env` setting)
5. Choose naming pattern: `game-1.pgn`, `game-2.pgn`, etc.

### 3.3 Create Round Folders

In your output directory, create:

```
Live/
└── round-1/
```

DGT LiveChess will save files here as `game-1.pgn`, `game-2.pgn`, etc.

## Step 4: Connect Your DGT Boards

1. Connect DGT e-Boards via USB
2. Verify they appear in DGT LiveChess
3. Assign board numbers (1, 2, 3...)
4. Enter player names and ratings

## Step 5: Start the Application

### Terminal 1 - Start Backend Server

```bash
npm run server
```

You should see:

```
🚀 Chess Broadcast Server
   Port: 8080
   DGT Path: C:/Users/user/Desktop/Live
   WebSocket: ws://localhost:8080/games

⏳ Waiting for connections...
```

### Terminal 2 - Start React App

```bash
npm start
```

Browser will open automatically at `http://localhost:3000`

## Step 6: Open the Live Broadcast

Navigate to: **http://localhost:3000/live**

You should see:

- ✅ Green "Connected" indicator
- 🏆 Live leaderboard (empty until games start)
- Board grid (will populate as games are detected)

## Step 7: Start a Game!

1. Set up a position on your DGT board
2. Make a move
3. Watch it appear in the broadcast! 🎉

---

## Verification Checklist

Before starting a tournament, verify:

- [ ] Server shows "✅ Watching board N at [path]" messages
- [ ] Browser shows "Connected" status (green dot)
- [ ] Test game appears on screen when you make a move
- [ ] Player names and ratings display correctly
- [ ] Clock times update (if enabled in DGT settings)
- [ ] Leaderboard updates when game finishes

---

## Common Issues

### "No games appearing"

- Check DGT LiveChess is running and saving files
- Verify folder structure: `Live/round-1/game-1.pgn`
- Check server console for errors

### "WebSocket Disconnected"

- Ensure server is running (`npm run server`)
- Check port 8080 is not blocked
- Try refreshing the browser

### "Clock times show 00:00:00"

- Enable clock output in DGT LiveChess settings
- Verify PGN files contain `[%clk H:MM:SS]` comments

---

## Testing Without DGT Boards

Create a test PGN file manually:

1. Create folder: `Live/round-1/`
2. Create file: `game-1.pgn`
3. Paste this content:

```
[Event "Test Game"]
[White "Alice"]
[Black "Bob"]
[WhiteElo "2100"]
[BlackElo "1950"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 *
```

4. Save and watch it appear in the broadcast!

---

## Next Steps

- Explore different layouts (Grid vs Split)
- Toggle leaderboard visibility
- Try other routes: `/games`, `/swiss`, etc.
- Customize components in `src/components/`

---

**Need help?** Check the full [README.md](README.md) for detailed documentation!
