CREATE TABLE IF NOT EXISTS "bookmark" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "order_id" real NOT NULL,
    "name" text NOT NULL,
    "url" text NOT NULL,
    "add_time" text NOT NULL,
    "favicon" text,
    "collection_id" integer,
    FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("collection_id") REFERENCES "collection" ("id") ON DELETE SET NULL
  );
  
  CREATE TABLE IF NOT EXISTS "collection" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "order_id" real NOT NULL,
    "name" text NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
  );
  
  
  CREATE TABLE IF NOT EXISTS "user" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" text NOT NULL UNIQUE,
    "password" text NOT NULL
  );

CREATE TABLE IF NOT EXISTS "session"(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "not_after" TEXT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);