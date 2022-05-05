CREATE TABLE IF NOT EXISTS "bookmark" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "order_id" real NOT NULL,
    "name" text NOT NULL,
    "url" text NOT NULL,
    "add_time" text NOT NULL,
    "favicon" text,
    FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
  );
  
  
  CREATE TABLE IF NOT EXISTS "bookmark_collection" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "bookmark_id" integer NOT NULL UNIQUE,
    "collection_id" integer NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("collection_id") REFERENCES "collection" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
    FOREIGN KEY ("bookmark_id") REFERENCES "bookmark" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
  );
  
  /*CREATE UNIQUE INDEX IF NOT EXISTS "bookmark_collection_bookmark_id_collection_id" ON "bookmark_collection" ("bookmark_id");*/
  
  
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