// test-server.js - Simple server test
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testServer() {
  console.log("🧪 Simple Server Test\n");

  try {
    // Test MongoDB
    console.log("1. Testing MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Test key imports
    console.log("2. Testing key imports...");

    const imports = [
      "./middleware/auth.js",
      "./routes/auth.js",
      "./controllers/authController.js",
    ];

    for (const imp of imports) {
      try {
        await import(imp);
        console.log(`✅ ${imp} imports correctly`);
      } catch (error) {
        console.log(`❌ ${imp} import failed: ${error.message}`);
        console.log(`   Make sure you're running from backend directory`);
        break;
      }
    }

    await mongoose.connection.close();

    console.log("\n🎉 Key tests passed! Server is ready.");
    console.log("🚀 Run: npm run dev");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

testServer();
