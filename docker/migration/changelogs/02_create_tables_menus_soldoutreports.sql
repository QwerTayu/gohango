--liquibase formatted sql
--changeset QwerTayu:1

--
-- Table structure for table `Menus`
--
CREATE TABLE Menus (
  menu_key CHAR(6) PRIMARY KEY,                            -- メニューkey（固定長6文字）
  name VARCHAR(256) NOT NULL,                              -- メニュー名
  type CHAR(1) NOT NULL,                                   -- タイプ（A, B, C）
  price INT NOT NULL,                                      -- 価格
  start_at DATE NOT NULL,                                  -- 提供開始日
  finish_at DATE NOT NULL,                                 -- 提供終了日
  allergy JSONB NOT NULL,                                  -- アレルギー情報（ローマ字文字列のJSON配列）
  badge VARCHAR(256)                                       -- 特別バッチ（NULL許容）
);

--
-- Dumping data for table `Menus`
--
INSERT INTO Menus (menu_key, name, type, price, start_at, finish_at, allergy, badge) VALUES
('5T4G8K', '豚肉の生姜焼きとコロッケ', 'A', 430, '2025-06-02', '2025-06-02', '["komugi", "tamago"]', NULL),
('L9N1V3', '照り煮チキン', 'A', 430, '2025-06-03', '2025-06-03', '["komugi", "tamago"]', NULL),
('A2B7D0', 'ミネストローネ風ハンバーグ', 'A', 430, '2025-06-04', '2025-06-04', '["komugi", "nyuu"]', '管理栄養士監修メニュー'),
('Z6X3C1', 'ぶりの竜田揚げ　みぞれぽん酢', 'A', 430, '2025-06-05', '2025-06-05', '["komugi"]', NULL),
('QW9E8R', '【大阪】鶏の唐揚げ　紅生姜風味', 'A', 430, '2025-06-06', '2025-06-06', '["komugi", "tamago"]', '日本唐揚げ協会認定！'),
('M1N2B4', '照りマヨチキン丼', 'B', 380, '2025-06-02', '2025-06-02', '["komugi", "tamago", "nyuu"]', NULL),
('P0O9I7', 'ハヤシライス', 'B', 380, '2025-06-03', '2025-06-03', '["komugi"]', '人気メニュー'),
('U6Y5T3', '鶏天丼', 'B', 380, '2025-06-04', '2025-06-04', '["komugi", "tamago"]', '人気メニュー'),
('H8J5K2', 'ビビンバ', 'B', 380, '2025-06-05', '2025-06-05', '["komugi", "tamago", "kani"]', NULL),
('F4G7S6', '豚キムチ丼', 'B', 380, '2025-06-06', '2025-06-06', '["komugi", "kani"]', NULL),
('D3C5V8', '白身魚フライとかぼちゃコロッケ', 'A', 430, '2025-06-09', '2025-06-09', '["komugi", "tamago", "nyuu"]', NULL),
('R2T1Y0', '香醋溜鶏塊(鶏肉の上海風黒酢ソース)', 'A', 430, '2025-06-10', '2025-06-10', '["komugi", "tamago"]', '中国'),
('E9W7Q5', 'チキン味噌かつ', 'A', 430, '2025-06-11', '2025-06-11', '["komugi", "tamago", "nyuu"]', NULL),
('B6N4M3', '豚肉の南蛮焼き', 'A', 430, '2025-06-12', '2025-06-12', '["komugi"]', NULL),
('I7O5P3', '豚しゃぶ　3種のネバネバソース', 'A', 430, '2025-06-13', '2025-06-13', '["komugi"]', '管理栄養士監修メニュー'),
('K2J8H6', '和風おろしハンバーグ丼', 'B', 380, '2025-06-09', '2025-06-09', '["komugi", "nyuu"]', NULL),
('S1D9F7', '牛肉と野菜のすき焼き丼', 'B', 380, '2025-06-10', '2025-06-10', '["komugi"]', NULL),
('G0C5V3', 'プルコギポーク丼', 'B', 380, '2025-06-11', '2025-06-11', '["komugi"]', NULL),
('X4Z8T6', 'イカ天丼', 'B', 380, '2025-06-12', '2025-06-12', '["komugi"]', NULL),
('Y1U9E7', 'ケチャップオムライス', 'B', 380, '2025-06-13', '2025-06-13', '["komugi", "tamago", "nyuu"]', '人気メニュー'),
('7A3S5D', 'ハンバーグデミグラスソース', 'A', 430, '2025-06-16', '2025-06-16', '["komugi", "nyuu"]', NULL),
('8F1G3H', '豚肉と野菜のオイスターソース炒め', 'A', 430, '2025-06-17', '2025-06-17', '["komugi"]', NULL),
('J9K7L5', 'たらのフリット香味トマトソース', 'A', 430, '2025-06-18', '2025-06-18', '["komugi", "tamago", "nyuu"]', '魚を食べよう'),
('M6N0B2', 'ソーセージのカツと玉子サラダフライ', 'A', 430, '2025-06-19', '2025-06-19', '["komugi", "tamago", "nyuu"]', NULL),
('V4C8X0', 'BBQチキン', 'A', 430, '2025-06-20', '2025-06-20', '["komugi", "tamago"]', NULL),
('Z2S4D6', '鶏肉きんぴら丼', 'B', 380, '2025-06-16', '2025-06-16', '["komugi"]', NULL),
('T8Y0U2', 'チキン南蛮丼', 'B', 380, '2025-06-17', '2025-06-17', '["komugi", "tamago"]', NULL),
('I4O6P8', 'スタミナ丼', 'B', 380, '2025-06-18', '2025-06-18', '["komugi"]', NULL),
('QW1E3R', '親子丼', 'B', 380, '2025-06-19', '2025-06-19', '["komugi", "tamago"]', NULL),
('A5S7D9', '麻婆豆腐飯', 'B', 380, '2025-06-20', '2025-06-20', '["komugi"]', NULL);


--changeset QwerTayu:2

--
-- Table structure for table `Soldout_reports`
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Soldout_reports (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- 一意なID（PK）
  menu_key CHAR(6) NOT NULL,                          -- メニューkey（MenusテーブルのFK）
  student_id VARCHAR(6) NOT NULL,                     -- 学籍番号（UsersテーブルのFK）
  reported_at TIMESTAMP NOT NULL,                     -- 報告日時
  is_soldout BOOLEAN NOT NULL,                        -- 売り切れかどうか

  CONSTRAINT fk_menu_key FOREIGN KEY (menu_key) REFERENCES Menus(menu_key),
  CONSTRAINT fk_student_id FOREIGN KEY (student_id) REFERENCES Users(student_id)
);
