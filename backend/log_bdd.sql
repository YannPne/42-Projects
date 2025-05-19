CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

SELECT id, displayName, password FROM users WHERE username = 'a'
SELECT displayName, avatar FROM users WHERE id = 2.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 2.0
SELECT * FROM games WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 2.0

    INSERT INTO friends (name1, name2)
    SELECT 'a', 'DailyCraft'
    WHERE EXISTS (SELECT 1 FROM users WHERE displayName = 'DailyCraft')
    AND NOT EXISTS (SELECT 1 FROM friends WHERE name1 = 'a' AND name2 = 'DailyCraft')
  
SELECT displayName, avatar FROM users WHERE id = 2.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 2.0
SELECT * FROM games WHERE name1 = 'a'
SELECT displayName, avatar FROM users WHERE id = 2.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 2.0
SELECT * FROM games WHERE name1 = 'a'
SELECT id, displayName, password FROM users WHERE username = 'a'
SELECT displayName, avatar FROM users WHERE id = 2.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 2.0
SELECT * FROM games WHERE name1 = 'a'
SELECT id, displayName, password FROM users WHERE username = 'LOCAL'
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

SELECT id, displayName, password FROM users WHERE username = 'a'
SELECT displayName, avatar FROM users WHERE id = 2.0
SELECT name2 FROM friends WHERE name1 = 'a'
SELECT displayName 
                              FROM users
                              WHERE id = 2.0
SELECT * FROM games WHERE name1 = 'a'
INSERT INTO games (name1, name2, score1, score2, date) VALUES ('a', 'AI', 0.0, 2.0, '2025-05-19')
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)
CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)
CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))

  INSERT OR IGNORE INTO users (username, displayName, password, avatar)
  VALUES ('LOCAL', 'AI', '', NULL)

