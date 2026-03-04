# ✅ DGT LiveChess Setup Checklist

Complete this checklist before your first broadcast to ensure everything works smoothly!

## 📋 Pre-Event Checklist

### Software Installation

- [ ] DGT LiveChess 2.2+ installed
- [ ] Node.js 14+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Environment file configured (`.env`)

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

### Server Configuration

- [ ] `DGT_BASE_PATH` in `.env` matches LiveChess output directory
- [ ] Server starts without errors (`npm run server`)
- [ ] Server shows "Watching board N" messages
- [ ] Port 8080 is open and not blocked

### Client Configuration

- [ ] React app starts without errors (`npm start`)
- [ ] Browser opens to `http://localhost:3000`
- [ ] Navigate to `/live` route works
- [ ] WebSocket shows "Connected" status (green dot)
- [ ] No console errors in browser

### Test Game

- [ ] Create test PGN file manually
- [ ] File appears in broadcast
- [ ] Player names display correctly
- [ ] Board renders properly
- [ ] Make a test move on physical board
- [ ] Move appears in broadcast within 2 seconds
- [ ] Clock times update (if enabled)
- [ ] Result displays when game ends

---

## 🎯 Tournament Day Checklist

### 1 Hour Before Start

- [ ] All DGT boards connected and powered on
- [ ] DGT LiveChess running
- [ ] Server running (`npm run server`)
- [ ] Client running (`npm start`)
- [ ] Test all boards with test positions
- [ ] Verify internet connection (if streaming externally)
- [ ] Backup system ready (extra laptop, cables)

### 15 Minutes Before Start

- [ ] Enter all player names in DGT LiveChess
- [ ] Enter player ratings
- [ ] Set clocks to starting time
- [ ] Clear any test games
- [ ] Refresh browser
- [ ] Display active on projector/screen
- [ ] Screenshot working state (for reference)

### Round Start

- [ ] Verify all boards are tracking
- [ ] Monitor server console for errors
- [ ] Check browser console for WebSocket issues
- [ ] Confirm leaderboard is visible
- [ ] Announce broadcast URL to spectators

### During Round

- [ ] Monitor for disconnections (red dot indicator)
- [ ] Check for board numbering mismatches
- [ ] Verify results are recorded correctly
- [ ] Watch for stuck games (no updates)
- [ ] Keep server/client terminals visible

### Round End

- [ ] Verify all results recorded
- [ ] Check leaderboard accuracy
- [ ] Screenshot final standings
- [ ] Archive PGN files
- [ ] Prepare for next round

---

## 🔧 Quick Troubleshooting

### Board Not Appearing

1. Check USB connection
2. Restart DGT LiveChess
3. Verify board number assigned
4. Check PGN file exists in correct folder

### WebSocket Disconnected

1. Check server is running
2. Refresh browser
3. Check firewall settings
4. Restart server if needed

### Moves Not Updating

1. Verify PGN file is being written
2. Check file path matches `.env`
3. Look for server console errors
4. Ensure file permissions are correct

### Clock Times Wrong

1. Enable clock output in DGT LiveChess
2. Check PGN contains `[%clk]` comments
3. Verify clock settings in LiveChess

### Leaderboard Not Updating

1. Verify game results are set (`1-0`, `0-1`, `1/2-1/2`)
2. Check player names match exactly
3. Refresh browser
4. Check browser console for errors

---

## 📊 Recommended Setup Configurations

### Small Tournament (1-4 boards)

- Layout: Grid view
- Leaderboard: Always visible
- Board size: Large (h-96, w-96)
- Update interval: 500ms

### Medium Tournament (5-10 boards)

- Layout: Split view with scrolling
- Leaderboard: Sidebar
- Board size: Medium (h-64, w-64)
- Update interval: 1000ms

### Large Tournament (10+ boards)

- Layout: Grid with pagination or filtering
- Leaderboard: Separate screen/tab
- Board size: Small (h-48, w-48)
- Update interval: 1000ms
- Consider multiple instances for different sections

---

## 🎥 Broadcast Best Practices

### Display Setup

- **Full HD (1920x1080)** recommended minimum
- **4K** ideal for large tournaments
- Use **browser full-screen mode** (F11)
- Disable browser notifications
- Set screen to never sleep

### Performance

- Close unnecessary browser tabs
- Use modern browser (Chrome, Firefox, Edge)
- Clear browser cache before event
- Disable browser extensions if issues occur

### Backup Plans

- Keep second laptop ready
- Have USB drive with project files
- Know how to quickly switch computers
- Screenshot working configuration

### Audience Experience

- Show connection status prominently
- Display tournament info (name, round, time)
- Update leaderboard between rounds
- Consider adding commentary/analysis board

---

## 📱 Mobile/Tablet Viewing

While designed for desktop, the responsive design works on mobile:

- Portrait: Stack boards vertically
- Landscape: 2-column grid
- Toggle leaderboard for more space
- Connection status always visible

Test on mobile devices before event!

---

## 🔐 Security Considerations

### Local Network Only

- Default configuration is local only (`localhost`)
- No external access by default
- Perfect for in-venue displays

### Public Internet Broadcast

If streaming publicly:

1. Update CORS settings in `.env`
2. Use reverse proxy (nginx, Apache)
3. Enable HTTPS
4. Set strong firewall rules
5. Consider authentication
6. Monitor bandwidth usage

---

## 📞 Emergency Contacts

Before the tournament, have these ready:

- [ ] DGT Technical Support: [contact info]
- [ ] Venue WiFi Administrator: [contact]
- [ ] Backup Technical Person: [contact]
- [ ] Tournament Organizer: [contact]

---

## ✅ Post-Event Tasks

- [ ] Archive all PGN files
- [ ] Export final standings
- [ ] Save configuration for next event
- [ ] Document any issues encountered
- [ ] Note any needed improvements
- [ ] Update this checklist based on learnings

---

## 📚 Additional Resources

- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Initial setup guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Customization guide
- DGT LiveChess Manual - Included with software
- Project Issues - Report bugs/request features

---

**Pro Tip:** Print this checklist and keep it with your tournament equipment!

Good luck with your broadcast! ♟️
