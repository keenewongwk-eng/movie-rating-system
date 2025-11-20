-- 簡單版本：使用 Prisma 的默認 ID 生成方式
-- 注意：Prisma 使用 cuid()，但 SQL 中我們使用 gen_random_uuid() 或直接插入

-- 清空所有數據
TRUNCATE TABLE ratings CASCADE;
TRUNCATE TABLE movies CASCADE;
TRUNCATE TABLE users CASCADE;

-- 插入用戶（使用簡單的 ID）
INSERT INTO users (id, name, icon, "createdAt", "updatedAt")
VALUES 
  ('user1', '瘋子', '😎', NOW(), NOW()),
  ('user2', '江子', '🐻', NOW(), NOW()),
  ('user3', '茶子', '🐨', NOW(), NOW());

-- 插入電影
INSERT INTO movies (id, title, image, "createdAt", "updatedAt")
VALUES 
  ('movie1', 'F1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOYEl7FMwMrIV4JXgwytAVp5JAlqXCBv8eLiwlg9mWjw&s=10', NOW(), NOW()),
  ('movie2', '工作細胞（真人版）', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyLj_6LPGSgLGR2GUB_rYZFKCkVeeYN-AwLqj-su20bQnz8ORYtSHqNXE&s=10', NOW(), NOW()),
  ('movie3', '全知讀者視覺', 'https://s.yimg.com/ny/api/res/1.2/lODA4SfLj63TkDVLfUv4Gg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM3Mw--/https://s.yimg.com/os/creatr-uploaded-images/2025-07/8eabcc90-648f-11f0-85ff-3a1e6e5ec174', NOW(), NOW()),
  ('movie4', '世外', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQETmx9MxTds92U2hpn9F2X5eYtsyVZfsRON_1vBUQnUPYTh2GQTG-S1lAK&s=10', NOW(), NOW());

-- 插入評分
INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
VALUES 
  ('rating1', 'movie1', 'user1', 4, 'Ok la', NOW(), NOW()),
  ('rating2', 'movie1', 'user2', 5, '型呀', NOW(), NOW()),
  ('rating3', 'movie1', 'user3', 4, 'Ok嘅！係唔理解點解慶功宴都唔去，又唔見情人一面，就瀟灑到頭也不回走左去😂唔講以為佢有絕症', NOW(), NOW()),
  ('rating4', 'movie2', 'user3', 5, '笑死🤣佐藤健靚仔到唔認得！
一班人一齊睇嘅輕鬆搞笑小品🖖🏼', NOW(), NOW()),
  ('rating5', 'movie3', 'user3', 2, '期待已久😂但唔知原來大製作到上埋宇宙
真係絕級天馬行空 + chok到嘔😂fun~', NOW(), NOW()),
  ('rating6', 'movie3', 'user1', 1, '電影頭前30分鐘還好仲算緊張刺激
中後部分節奏開始拖慢
人物動機離曬大譜
主角廢到笑 勁嗰個主角chok到笑……', NOW(), NOW()),
  ('rating7', 'movie4', 'user3', 3, '畫風靚！但啲配音真係唔得😂勁出戲好尷尬呀🥶
聽講係催淚片但完全喊唔出', NOW(), NOW());

-- 驗證數據
SELECT 'Users: ' || COUNT(*) FROM users
UNION ALL
SELECT 'Movies: ' || COUNT(*) FROM movies
UNION ALL
SELECT 'Ratings: ' || COUNT(*) FROM ratings;

