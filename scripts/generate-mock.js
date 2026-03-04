#!/usr/bin/env node

const PGNGenerator = require("../server/pgn-generator");

/**
 * Quick start script to generate static mock games
 */

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const boardCount = parseInt(args[0]) || 4;
  const round = parseInt(args[1]) || 1;
  const basePath = args[2] || "./Live";

  console.log("\n🎲 Static Mock Game Generator");
  console.log("=".repeat(50));

  const generator = new PGNGenerator(basePath);

  // Ask if user wants to clear existing data
  if (args.includes("--clear") || args.includes("-c")) {
    await generator.clearMockData();
  }

  // Generate games
  try {
    await generator.generateMultipleGames(boardCount, round, {
      ongoing: args.includes("--ongoing") || args.includes("-o"),
      event: "Mock Tournament",
      moveCount: Math.floor(Math.random() * 30) + 10,
    });

    console.log("✅ Mock games created successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Start the server: npm run server");
    console.log("   2. Start the app: npm start");
    console.log("   3. Open http://localhost:3000/live\n");
  } catch (error) {
    console.error("\n❌ Error generating games:", error.message);
    process.exit(1);
  }
}

// Help text
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("\nUsage: npm run mock [boards] [round] [path]");
  console.log("\nOptions:");
  console.log("  --clear, -c      Clear existing mock data first");
  console.log("  --ongoing, -o    Generate ongoing games (result: *)");
  console.log("  --help, -h       Show this help\n");
  console.log("Examples:");
  console.log("  npm run mock              # 4 boards, round 1");
  console.log("  npm run mock 8            # 8 boards, round 1");
  console.log("  npm run mock 6 2          # 6 boards, round 2");
  console.log("  npm run mock -- --clear   # Clear and generate 4 boards\n");
  process.exit(0);
}

main();
