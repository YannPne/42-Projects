CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

SELECT id, displayName, password FROM users WHERE username = 'a'
INSERT INTO users (username, displayName, email, password)
                                 SELECT 'a', 'a', 'ca@gmail.com', '$2b$10$4kDWfe420GvgG7sa69v7w.7r5'/*+28 bytes*/
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = 'a' AND displayName = 'a')
UPDATE users SET avatar = x'52494646f0e20000574542505650384ce3e200002f8fc163104d48ac6d376c9b'/*+58072 bytes*/ WHERE username = 'a'
SELECT displayName, avatar FROM users WHERE id = 15.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0
SELECT * FROM games WHERE name1 = 'a'
SELECT id, displayName, password FROM users WHERE username = 'a'
SELECT displayName, avatar FROM users WHERE id = 15.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0
SELECT * FROM games WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0

    INSERT INTO friends (name1, name2)
    SELECT 'a', 'ca'
    WHERE EXISTS (SELECT 1 FROM users WHERE displayName = 'ca')
    AND NOT EXISTS (SELECT 1 FROM friends WHERE name1 = 'a' AND name2 = 'ca')
  
INSERT INTO games (name1, name2, score1, score2, date) VALUES ('a', 'AI', 0.0, 5.0, '2025-05-18')
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

SELECT id, displayName, password FROM users WHERE username = 'a'
SELECT displayName, avatar FROM users WHERE id = 15.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0
SELECT * FROM games WHERE name1 = 'a'
INSERT INTO games (name1, name2, score1, score2, date) VALUES ('a', 'salut', 0.0, 2.0, '2025-05-18')
SELECT displayName, avatar FROM users WHERE id = 15.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0
SELECT * FROM games WHERE name1 = 'a'
INSERT INTO users (username, displayName, email, password)
                                 SELECT 'test', 'test', 'ca@gmail.com', '$2b$10$dBRpxM5F/.K8CnWih0WLcORCx'/*+28 bytes*/
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = 'test' AND displayName = 'test')
UPDATE users SET avatar = x'52494646f0e20000574542505650384ce3e200002f8fc163104d48ac6d376c9b'/*+58072 bytes*/ WHERE username = 'test'
SELECT displayName, avatar FROM users WHERE id = 17.0
SELECT name2 FROM friends WHERE name1 = 'test'
SELECT displayName 
                              FROM users
                              WHERE id = 17.0
SELECT * FROM games WHERE name1 = 'test'
INSERT INTO games (name1, name2, score1, score2, date) VALUES ('test', 'a', 2.0, 0.0, '2025-05-18')
SELECT displayName, avatar FROM users WHERE id = 15.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0
SELECT * FROM games WHERE name1 = 'a'
SELECT id, displayName, password FROM users WHERE username = 'a'
SELECT displayName, avatar FROM users WHERE id = 15.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0
SELECT * FROM games WHERE name1 = 'a'
SELECT displayName, avatar FROM users WHERE id = 17.0
SELECT name2 FROM friends WHERE name1 = 'test'
SELECT displayName 
                              FROM users
                              WHERE id = 17.0
SELECT * FROM games WHERE name1 = 'test'
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

SELECT id, displayName, password FROM users WHERE username = 'a'
INSERT INTO games (name1, name2, score1, score2, date) VALUES ('a', 'AI', 0.0, 2.0, '2025-05-18')
SELECT displayName, avatar FROM users WHERE id = 15.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 15.0
SELECT * FROM games WHERE name1 = 'a'
INSERT INTO users (username, displayName, email, password)
                                 SELECT 'er', 'er', 'ca@gmail.com', '$2b$10$H2cYYPDMgyhyliE.h0et4uBOz'/*+28 bytes*/
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = 'er' AND displayName = 'er')
INSERT INTO users (username, displayName, email, password)
                                 SELECT 'er', 'er', 'ca@gmail.com', '$2b$10$zTzL6joyaF4lJ5PJ.IwV4.2Jm'/*+28 bytes*/
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = 'er' AND displayName = 'er')
INSERT INTO users (username, displayName, email, password)
                                 SELECT 'er', 'er', 'ca@gmail.com', '$2b$10$1mYKd/9sEjzgavBlZ1YBHupJJ'/*+28 bytes*/
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = 'er' AND displayName = 'er')
INSERT INTO users (username, displayName, email, password)
                                 SELECT 'er', 'er', 'ca@gmail.com', '$2b$10$L/B0Fw06uWMEUdYeB0Cfl.V4a'/*+28 bytes*/
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = 'er' AND displayName = 'er')
