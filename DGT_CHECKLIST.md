# DGT LiveChess Setup Checklist

Complete this checklist before your first broadcast to ensure everything works smoothly.

## Pre-Event Checklist

### Software Installation

- [ ] DGT LiveChess 2.2+ installed
- [ ] Chess Broadcast desktop app installed (download from GitHub Releases)
- [ ] Stockfish installed and on PATH (optional, for live engine evaluation)

### DGT LiveChess Configuration

- [ ] DGT LiveChess launches without errors
- [ ] USB drivers installed for DGT boards
- [ ] All boards appear in device list
- [ ] Board numbers assigned (1, 2, 3, etc.)
- [ ] PGN file output enabled
- [ ] Output directory configured
- [ ] File naming pattern set to `game-N.pgn`
- [ ] Clock display enabled (optional but recommended)
- [ ] Round folders created (`round-1`, `round-2`, etc.)

### Desktop App Configuration

- [ ] App opens and shows the dashboard
- [ ] DGT base path configured (Settings or `.env`) to match LiveChess output directory
- [ ] Simulator test runs successfully (start/stop from dashboard)
- [ ] Live view opens and shows boards
- [ ] Port 8080 is open and not blocked by firewall

### Test Game

- [ ] Create test PGN file manually in `round-1/game-1.pgn`
- [ ] File appears in broadcast
- [ ] Player names display correctly
- [ ] Board renders properly
- [ ] Make a test move on physical board
- [ ] Move appears in broadcast within 2 seconds
- [ ] Clock times update (if enabled)
- [ ] Result displays when game ends

---

## Tournament Day Checklist

### 1 Hour Before Start

- [ ] All DGT boards connected and powered on
- [ ] DGT LiveChess running
- [ ] Chess Broadcast app running
- [ ] Test all boards with test positions
- [ ] Verify network connection (WiFi/LAN for spectators)
- [ ] Backup system ready (extra laptop, cables)

### 15 Minutes Before Start

- [ ] Enter all player names in DGT LiveChess
- [ ] Enter player ratings
- [ ] Set clocks to starting time
- [ ] Clear any test games
- [ ] Display active on projector/screen
- [ ] Share spectator URL or QR code

### Round Start

- [ ] Verify all boards are tracking (check dashboard status)
- [ ] Confirm leaderboard is visible
- [ ] Announce broadcast URL to spectators

### During Round

- [ ] Monitor dashboard for disconnections or errors
- [ ] Check for board numbering mismatches
- [ ] Verify results are recorded correctly
- [ ] Watch for stuck games (no updates)

### Round End

- [ ] Verify all results recorded
- [ ] Check leaderboard accuracy
- [ ] Screenshot final standings
- [ ] Archive PGN files
- [ ] Prepare for next round

---

## Quick Troubleshooting

### Board Not Appearing

1. Check USB connection
2. Restart DGT LiveChess
3. Verify board number assigned
4. Check PGN file exists in correct folder

### Moves Not Updating

1. Verify PGN file is being written by DGT LiveChess
2. Check DGT base path matches in app settings
3. Enable `DEBUG=true` in `.env` for detailed logs
4. Ensure file permissions are correct

### Clock Times Wrong

1. Enable clock output in DGT LiveChess
2. Check PGN contains `[%clk]` comments
3. Verify clock settings in LiveChess

### Leaderboard Not Updating

1. Verify game results are set (`1-0`, `0-1`, `1/2-1/2`)
2. Check player names match exactly across games
3. Refresh the live view

---

## Recommended Setup Configurations

### Small Tournament (1-4 boards)

- Board size: Large
- Leaderboard: Always visible
- Layout: Grid view

### Medium Tournament (5-10 boards)

- Board size: Medium
- Leaderboard: Sidebar
- Layout: Split view with scrolling

### Large Tournament (10+ boards)

- Board size: Small
- Leaderboard: Separate screen/tab
- Consider auto-cycling featured board

---

## Broadcast Best Practices

### Display Setup

- **Full HD (1920x1080)** recommended minimum
- Use **browser full-screen mode** (F11) for spectator displays
- Disable browser notifications
- Set screen to never sleep

### Backup Plans

- Keep second laptop ready
- Have USB drive with installer
- Know how to quickly switch computers
- Screenshot working configuration

---

## Post-Event Tasks

- [ ] Archive all PGN files
- [ ] Export final standings
- [ ] Save configuration for next event
- [ ] Document any issues encountered
- [ ] Note any needed improvements

---

**Pro Tip:** Print this checklist and keep it with your tournament equipment!
