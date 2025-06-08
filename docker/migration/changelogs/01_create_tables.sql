-- Liquibase changelog for Users
-- Author: QwerTayu
-- ChangeSet ID: 1

CREATE TABLE Users (
  student_id VARCHAR(6) PRIMARY KEY, -- 学籍番号
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- 登録日付。自動生成
);
