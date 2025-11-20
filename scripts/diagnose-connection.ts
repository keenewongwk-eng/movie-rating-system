import { getDatabaseUrl } from "../lib/config";

console.log("🔍 Database Connection Diagnostics\n");
console.log("=".repeat(60));

try {
  const dbUrl = getDatabaseUrl();

  // 解析連接字符串
  const url = new URL(dbUrl);

  console.log("✅ Connection string loaded successfully\n");
  console.log("Connection Details:");
  console.log("  Protocol:", url.protocol);
  console.log("  Username:", url.username);
  console.log("  Host:", url.hostname);
  console.log("  Port:", url.port);
  console.log("  Database:", url.pathname.substring(1));
  console.log("");

  // 檢查格式
  console.log("Format Checks:");

  // 檢查用戶名格式
  if (url.username.includes(".")) {
    console.log("  ✅ Username format: Correct (contains project reference)");
  } else {
    console.log("  ⚠️  Username format: May be incorrect");
    console.log("     Expected: postgres.[PROJECT-REF]");
    console.log("     Got:", url.username);
  }

  // 檢查主機格式
  if (url.hostname.includes("pooler.supabase.com")) {
    console.log("  ✅ Host format: Correct (using connection pooler)");
  } else if (url.hostname.includes("supabase.co")) {
    console.log("  ⚠️  Host format: Using direct connection (not pooler)");
    console.log("     Consider using connection pooler for better performance");
  } else {
    console.log("  ❌ Host format: Unknown format");
  }

  // 檢查端口
  if (url.port === "5432") {
    console.log("  ✅ Port: Correct (Session mode for Prisma)");
  } else if (url.port === "6543") {
    console.log("  ⚠️  Port: Transaction mode (not ideal for Prisma)");
    console.log("     Consider using port 5432 (Session mode)");
  } else {
    console.log("  ❌ Port: Unexpected port", url.port);
  }

  console.log("");
  console.log("=".repeat(60));
  console.log("\n💡 Troubleshooting Tips:");
  console.log("1. Check if Supabase project is Active (not Paused)");
  console.log("2. Verify the connection string in Supabase Dashboard:");
  console.log(
    "   Project Settings > Database > Connection pooling > Session mode"
  );
  console.log("3. Ensure the password is correct");
  console.log("4. Check network connectivity");
  console.log("\n📋 Full connection string (masked):");
  const masked = dbUrl.replace(/:([^:@]+)@/, ":****@");
  console.log(masked);
} catch (error: any) {
  console.error("❌ Failed to load connection string");
  console.error("Error:", error.message);
  process.exit(1);
}
