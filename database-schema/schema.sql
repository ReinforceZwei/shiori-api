-- Adminer 4.8.1 SQLite 3 3.31.1 dump

DROP TABLE IF EXISTS "bookmark";
CREATE TABLE "bookmark" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" integer NOT NULL,
  "order_id" integer NOT NULL,
  "name" text NOT NULL,
  "url" text NOT NULL,
  "add_time" integer NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);


DROP TABLE IF EXISTS "bookmark_collection";
CREATE TABLE "bookmark_collection" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" integer NOT NULL,
  "bookmark_id" integer NOT NULL,
  "collection_id" integer NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("collection_id") REFERENCES "collection" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
  FOREIGN KEY ("bookmark_id") REFERENCES "bookmark" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "bookmark_collection_bookmark_id_collection_id" ON "bookmark_collection" ("bookmark_id", "collection_id");


DROP TABLE IF EXISTS "collection";
CREATE TABLE "collection" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" integer NOT NULL,
  "name" text NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE
);


DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" text NOT NULL,
  "password" text NOT NULL
);


-- 
