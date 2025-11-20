import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("開始清空數據...");

  // 按照外鍵順序刪除（先刪除子表，再刪除父表）
  const deletedRatings = await prisma.rating.deleteMany({});
  console.log(`已刪除 ${deletedRatings.count} 個評分`);

  const deletedMovies = await prisma.movie.deleteMany({});
  console.log(`已刪除 ${deletedMovies.count} 部電影`);

  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`已刪除 ${deletedUsers.count} 個用戶`);

  console.log("數據清空完成！");
}

main()
  .catch((e) => {
    console.error("清空數據時發生錯誤:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

