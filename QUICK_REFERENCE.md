# ⚡ Quick Reference Card

## 🚀 Commands

### Simulation (No DGT Boards Needed)

```bash
npm run simulate:quick      # Start live sim (4 boards)
npm run simulate:quick 8    # Start live sim (8 boards)
npm run simulate            # Interactive mode
```

### Server & App

```bash
npm run server             # Start WebSocket server
npm start                  # Start React app
npm run build              # Build for production
```

---

## 🎯 Quick Start Workflows

### Test Without DGT Boards

```bash
# Terminal 1
npm run simulate:quick

# Terminal 2
npm run server

# Terminal 3
npm start

# Open: http://localhost:3000/live
```

### Use With DGT Boards

```bash
# 1. Setup DGT LiveChess to save PGN files
# 2. Update .env with correct path
# 3. Start server
npm run server

# 4. Start app
npm start

# 5. Open: http://localhost:3000/live
```

---

## 📁 Project Structure

```
broadcasts/
├── server/              # Backend
│   ├── server.js       # WebSocket server
│   ├── config.js       # Configuration
│   ├── parse-game.js   # PGN parser
│   ├── simulator.js    # Live game simulator
│   ├── mock-data.js    # Test data
│   └── pgn-generator.js
├── src/
│   ├── hooks/          # React hooks
│   │   └── usePgn.js   # WebSocket hook
│   ├── components/     # UI components
│   │   ├── Board/      # Chess board
│   │   ├── Viewer/     # Game viewer
│   │   └── Shared/
│   │       └── LiveLeaderboard.js
│   └── pages/
│       └── LiveBroadcast.js  # Main page
└── .env               # Configuration
```

---

## 🔌 Key Routes

| URL         | Description                           |
| ----------- | ------------------------------------- |
| `/live`     | **Main broadcast page** (recommended) |
| `/games`    | Original multi-board view             |
| `/swiss`    | Swiss tournament                      |
| `/robin`    | Round robin                           |
| `/congress` | Congress format                       |

---

## 🎮 Simulator Options

### Live Simulator

- **Purpose**: Real-time game simulation
- **Updates**: Every 2-10 seconds (configurable)
- **Features**: Moving clocks, realistic games
- **Use case**: Testing live functionality

### Mock Generator

- **Purpose**: Static game creation
- **Updates**: None (one-time generation)
- **Features**: Quick setup, specific scenarios
- **Use case**: UI testing only

---

## 🐛 Troubleshooting

### Issue: No games appearing

```bash
# Check DGT path
cat .env | grep DGT_BASE_PATH

# Verify files exist
ls Live/round-1/

# Restart server
# Ctrl+C in server terminal, then:
npm run server
```

### Issue: WebSocket disconnected

```bash
# Check server is running
# Look for: "🚀 Chess Broadcast Server"

# Refresh browser
# Check browser console for errors
```

### Issue: Simulator not updating

```bash
# Restart simulator
# Ctrl+C, then:
npm run simulate:quick
```

---

## 📝 .env Configuration

```bash
# Server
PORT=8080                    # WebSocket port
CORS_ORIGIN=*               # CORS setting

# DGT Path (IMPORTANT!)
DGT_BASE_PATH=C:/Users/user/Desktop/Live

# Or for Mac/Linux:
DGT_BASE_PATH=/Users/user/Desktop/Live

# Settings
MAX_BOARDS=20               # Max simultaneous boards
DEBUG=false                 # Enable debug logs
```

---

## 🎨 Customization Quick Tips

### Change Colors

Edit component files, replace `orange-500` with your color:

- `src/components/Board/Board.js`
- `src/pages/LiveBroadcast.js`
- `src/components/Shared/LiveLeaderboard.js`

### Board Size

Edit `src/components/Board/Board.js`:

```javascript
<div className="h-64 w-64">  // Change size
```

### Update Speed

Edit `server/simulator.js`:

```javascript
updateInterval: 3000; // 3 seconds
```

---

## 📚 Documentation Files

| File                                 | Purpose                |
| ------------------------------------ | ---------------------- |
| [README.md](README.md)               | Complete documentation |
| [SETUP.md](SETUP.md)                 | 5-minute setup guide   |
| [SIMULATOR.md](SIMULATOR.md)         | Mock & testing guide   |
| [DGT_CHECKLIST.md](DGT_CHECKLIST.md) | Tournament checklist   |
| [DEVELOPMENT.md](DEVELOPMENT.md)     | Developer guide        |

---

## 🔥 Common Commands Cheat Sheet

```bash
# Development
npm install                 # Install dependencies
npm run server             # Start backend
npm start                  # Start frontend
npm run build              # Build production

# Testing
npm run simulate:quick     # Quick sim (4 boards)
npm run simulate:quick 12  # Many boards

# Help
npm run simulate -- --help # Simulator help
```

---

## 🎯 Production Checklist

For live tournaments:

- [ ] Test with simulator first
- [ ] Configure `.env` with correct paths
- [ ] Test with 1 real DGT board
- [ ] Verify WebSocket connection
- [ ] Check leaderboard updates
- [ ] Test on projector/display
- [ ] Have backup laptop ready
- [ ] Print [DGT_CHECKLIST.md](DGT_CHECKLIST.md)

---

## 💡 Pro Tips

1. **Always test with simulator first** - It's faster than setting up hardware
2. **Use Grid layout for ≤6 boards** - Better visibility
3. **Use Split layout for >6 boards** - Better organization
4. **Enable DEBUG in development** - See what's happening
5. **Keep server terminal visible** - Monitor connections
6. **Refresh browser if issues** - Simple but effective

---

## 🆘 Emergency Fixes

**Nothing works:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run server  # Terminal 1
npm start       # Terminal 2
```

**Can't connect:**

```bash
# Check port 8080 is free
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill process and restart
```

**Old data stuck:**

```bash
rm -rf ./Live
npm run simulate:quick
```

---

**Need more help?** Check the full [README.md](README.md) or specific guide for your needs!

**Print this card** and keep it handy during development! 📋
