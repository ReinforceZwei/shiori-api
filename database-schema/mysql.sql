CREATE TABLE IF NOT EXISTS `user`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` TEXT NOT NULL UNIQUE,
    `password` TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS `session`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` TEXT NOT NULL UNIQUE,
    `not_after` TEXT NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `collection`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `order_id` REAL NOT NULL,
    `name` TEXT NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `bookmark`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `order_id` REAL NOT NULL,
    `name` TEXT NOT NULL,
    `url` TEXT NOT NULL,
    `add_time` TEXT NOT NULL,
    `collection_id` INTEGER,
    `favicon` TEXT,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`collection_id`) REFERENCES `collection`(`id`) ON DELETE SET NULL
);