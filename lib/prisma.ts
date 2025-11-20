import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 驗證環境變數（延遲檢查，因為在模塊加載時環境變數可能還沒載入）
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL environment variable is not set!");
    console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("DB")));
    console.error("Please check your .env or .env.local file.");
    throw new Error("DATABASE_URL environment variable is required");
  }
  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
