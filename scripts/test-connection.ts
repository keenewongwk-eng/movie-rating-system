import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "../lib/config";

async function testConnection() {
  console.log("🔍 Testing database connection...\n");

  // 顯示連接字符串（隱藏密碼）
  try {
    const dbUrl = getDatabaseUrl();
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");
    console.log("📋 Connection string:", maskedUrl);
    console.log("");

    // 創建 Prisma Client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: ["error", "warn"],
    });

    // 測試 1: 基本連接
    console.log("Test 1: Basic connection...");
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Basic connection: SUCCESS\n");
    } catch (error: any) {
      console.error("❌ Basic connection: FAILED");
      console.error("Error:", error.message);
      await prisma.$disconnect();
      process.exit(1);
    }

    // 測試 2: 查詢數據庫版本
    console.log("Test 2: Database version...");
    try {
      const result = await prisma.$queryRaw<Array<{ version: string }>>`
        SELECT version()
      `;
      console.log("✅ Database version:", result[0]?.version || "Unknown");
      console.log("");
    } catch (error: any) {
      console.error("❌ Database version query: FAILED");
      console.error("Error:", error.message);
    }

    // 測試 3: 檢查表是否存在
    console.log("Test 3: Checking tables...");
    try {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `;
      console.log(
        "✅ Found tables:",
        tables.map((t) => t.tablename).join(", ") || "None"
      );
      console.log("");
    } catch (error: any) {
      console.error("❌ Table check: FAILED");
      console.error("Error:", error.message);
    }

    // 測試 4: 測試 Prisma Client 查詢
    console.log("Test 4: Prisma Client query...");
    try {
      const movieCount = await prisma.movie.count();
      console.log("✅ Prisma Client: SUCCESS");
      console.log(`   Found ${movieCount} movies in database\n`);
    } catch (error: any) {
      console.error("❌ Prisma Client query: FAILED");
      console.error("Error:", error.message);
      console.error(
        "\n💡 Tip: Run 'npm run db:push' to create the database schema"
      );
    }

    // 關閉連接
    await prisma.$disconnect();

    console.log("🎉 All tests completed!");
  } catch (error: any) {
    console.error("\n❌ Connection test failed!");
    console.error("Error:", error.message);
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
    process.exit(1);
  }
}

testConnection();
