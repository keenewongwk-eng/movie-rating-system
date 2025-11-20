-- 清空數據（按照外鍵順序）
DELETE FROM ratings;
DELETE FROM movies;
DELETE FROM users;

-- 重置序列（如果使用自動遞增 ID）
-- 注意：Prisma 使用 cuid()，所以不需要重置序列

-- 插入用戶
INSERT INTO users (id, name, icon, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, '瘋子', '😎', NOW(), NOW()),
  (gen_random_uuid()::text, '江子', '🐻', NOW(), NOW()),
  (gen_random_uuid()::text, '茶子', '🐨', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 插入電影
INSERT INTO movies (id, title, image, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'F1', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOYEl7FMwMrIV4JXgwytAVp5JAlqXCBv8eLiwlg9mWjw&s=10', NOW(), NOW()),
  (gen_random_uuid()::text, '工作細胞（真人版）', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyLj_6LPGSgLGR2GUB_rYZFKCkVeeYN-AwLqj-su20bQnz8ORYtSHqNXE&s=10', NOW(), NOW()),
  (gen_random_uuid()::text, '全知讀者視覺', 'https://s.yimg.com/ny/api/res/1.2/lODA4SfLj63TkDVLfUv4Gg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM3Mw--/https://s.yimg.com/os/creatr-uploaded-images/2025-07/8eabcc90-648f-11f0-85ff-3a1e6e5ec174', NOW(), NOW()),
  (gen_random_uuid()::text, '世外', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQETmx9MxTds92U2hpn9F2X5eYtsyVZfsRON_1vBUQnUPYTh2GQTG-S1lAK&s=10', NOW(), NOW())
ON CONFLICT (title) DO NOTHING;

-- 插入評分（需要先獲取用戶和電影的 ID）
-- 注意：由於 Prisma 使用 cuid()，我們需要使用子查詢來獲取 ID

INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  m.id,
  u1.id,
  4,
  'Ok la',
  NOW(),
  NOW()
FROM movies m, users u1
WHERE m.title = 'F1' AND u1.name = '瘋子'
ON CONFLICT ("movieId", "userId") DO NOTHING;

INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  m.id,
  u2.id,
  5,
  '型呀',
  NOW(),
  NOW()
FROM movies m, users u2
WHERE m.title = 'F1' AND u2.name = '江子'
ON CONFLICT ("movieId", "userId") DO NOTHING;

INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  m.id,
  u3.id,
  4,
  'Ok嘅！係唔理解點解慶功宴都唔去，又唔見情人一面，就瀟灑到頭也不回走左去😂唔講以為佢有絕症',
  NOW(),
  NOW()
FROM movies m, users u3
WHERE m.title = 'F1' AND u3.name = '茶子'
ON CONFLICT ("movieId", "userId") DO NOTHING;

INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  m.id,
  u3.id,
  5,
  '笑死🤣佐藤健靚仔到唔認得！
一班人一齊睇嘅輕鬆搞笑小品🖖🏼',
  NOW(),
  NOW()
FROM movies m, users u3
WHERE m.title = '工作細胞（真人版）' AND u3.name = '茶子'
ON CONFLICT ("movieId", "userId") DO NOTHING;

INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  m.id,
  u3.id,
  2,
  '期待已久😂但唔知原來大製作到上埋宇宙
真係絕級天馬行空 + chok到嘔😂fun~',
  NOW(),
  NOW()
FROM movies m, users u3
WHERE m.title = '全知讀者視覺' AND u3.name = '茶子'
ON CONFLICT ("movieId", "userId") DO NOTHING;

INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  m.id,
  u1.id,
  1,
  '電影頭前30分鐘還好仲算緊張刺激
中後部分節奏開始拖慢
人物動機離曬大譜
主角廢到笑 勁嗰個主角chok到笑……',
  NOW(),
  NOW()
FROM movies m, users u1
WHERE m.title = '全知讀者視覺' AND u1.name = '瘋子'
ON CONFLICT ("movieId", "userId") DO NOTHING;

INSERT INTO ratings (id, "movieId", "userId", rating, review, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  m.id,
  u3.id,
  3,
  '畫風靚！但啲配音真係唔得😂勁出戲好尷尬呀🥶
聽講係催淚片但完全喊唔出',
  NOW(),
  NOW()
FROM movies m, users u3
WHERE m.title = '世外' AND u3.name = '茶子'
ON CONFLICT ("movieId", "userId") DO NOTHING;

-- 驗證數據
SELECT 
  (SELECT COUNT(*) FROM users) as user_count,
  (SELECT COUNT(*) FROM movies) as movie_count,
  (SELECT COUNT(*) FROM ratings) as rating_count;

