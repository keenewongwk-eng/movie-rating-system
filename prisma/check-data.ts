import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const movies = await prisma.movie.findMany();
  const ratings = await prisma.rating.findMany({
    include: {
      movie: true,
      user: true,
    },
  });

  console.log(`用戶數量: ${users.length}`);
  users.forEach((user) => {
    console.log(`  - ${user.icon} ${user.name} (${user.id})`);
  });

  console.log(`\n電影數量: ${movies.length}`);
  movies.forEach((movie) => {
    console.log(`  - ${movie.title} (${movie.id})`);
  });

  console.log(`\n評分數量: ${ratings.length}`);
  ratings.forEach((rating) => {
    console.log(
      `  - ${rating.user.icon} ${rating.user.name} 給 ${rating.movie.title} 評了 ${rating.rating} 星`
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
