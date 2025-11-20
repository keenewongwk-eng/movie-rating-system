import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("開始導入示例數據...");

  try {
    // 創建示例用戶
    console.log("創建用戶...");
    const user1 = await prisma.user.upsert({
      where: { name: "瘋子" },
      update: {},
      create: {
        name: "瘋子",
        icon: "😎",
      },
    });

    const user2 = await prisma.user.upsert({
      where: { name: "江子" },
      update: {},
      create: {
        name: "江子",
        icon: "🐻",
      },
    });

    const user3 = await prisma.user.upsert({
      where: { name: "茶子" },
      update: {},
      create: {
        name: "茶子",
        icon: "🐨",
      },
    });

    // 創建示例電影
    const movie1 = await prisma.movie.upsert({
      where: { title: "F1" },
      update: {},
      create: {
        title: "F1",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOYEl7FMwMrIV4JXgwytAVp5JAlqXCBv8eLiwlg9mWjw&s=10",
      },
    });

    const movie2 = await prisma.movie.upsert({
      where: { title: "工作細胞（真人版）" },
      update: {},
      create: {
        title: "工作細胞（真人版）",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyLj_6LPGSgLGR2GUB_rYZFKCkVeeYN-AwLqj-su20bQnz8ORYtSHqNXE&s=10",
      },
    });

    const movie3 = await prisma.movie.upsert({
      where: { title: "全知讀者視覺" },
      update: {},
      create: {
        title: "全知讀者視覺",
        image:
          "https://s.yimg.com/ny/api/res/1.2/lODA4SfLj63TkDVLfUv4Gg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM3Mw--/https://s.yimg.com/os/creatr-uploaded-images/2025-07/8eabcc90-648f-11f0-85ff-3a1e6e5ec174",
      },
    });

    const movie4 = await prisma.movie.upsert({
      where: { title: "世外" },
      update: {},
      create: {
        title: "世外",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQETmx9MxTds92U2hpn9F2X5eYtsyVZfsRON_1vBUQnUPYTh2GQTG-S1lAK&s=10",
      },
    });

    // 創建示例評分（使用 findFirst 檢查是否已存在主評論）
    const createRatingIfNotExists = async (
      movieId: string,
      userId: string,
      rating: number,
      review: string
    ) => {
      const existing = await prisma.rating.findFirst({
        where: {
          movieId,
          userId,
          parentId: null, // 只檢查主評論
        },
      });

      if (!existing) {
        await prisma.rating.create({
          data: {
            movieId,
            userId,
            rating,
            review,
          },
        });
      }
    };

    await createRatingIfNotExists(movie1.id, user1.id, 4, "Ok la");
    await createRatingIfNotExists(movie1.id, user2.id, 5, "型呀");
    await createRatingIfNotExists(
      movie1.id,
      user3.id,
      4,
      "Ok嘅！係唔理解點解慶功宴都唔去，又唔見情人一面，就瀟灑到頭也不回走左去😂唔講以為佢有絕症"
    );
    await createRatingIfNotExists(
      movie2.id,
      user3.id,
      5,
      "笑死🤣佐藤健靚仔到唔認得！\n一班人一齊睇嘅輕鬆搞笑小品🖖🏼"
    );
    await createRatingIfNotExists(
      movie3.id,
      user3.id,
      2,
      "期待已久😂但唔知原來大製作到上埋宇宙\n真係絕級天馬行空 + chok到嘔😂fun~"
    );
    await createRatingIfNotExists(
      movie3.id,
      user1.id,
      1,
      "電影頭前30分鐘還好仲算緊張刺激\n中後部分節奏開始拖慢\n人物動機離曬大譜\n主角廢到笑 勁嗰個主角chok到笑……"
    );
    await createRatingIfNotExists(
      movie4.id,
      user3.id,
      3,
      "畫風靚！但啲配音真係唔得😂勁出戲好尷尬呀🥶\n聽講係催淚片但完全喊唔出"
    );

    console.log("示例數據導入完成！");
    console.log(`已創建 ${await prisma.user.count()} 個用戶`);
    console.log(`已創建 ${await prisma.movie.count()} 部電影`);
    console.log(`已創建 ${await prisma.rating.count()} 個評分`);
  } catch (error) {
    console.error("導入數據時發生錯誤:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
