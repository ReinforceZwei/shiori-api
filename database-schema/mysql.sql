CREATE TABLE IF NOT EXISTS `user`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `password` TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS `bookmark`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `order_id` REAL NOT NULL,
    `name` TEXT NOT NULL,
    `url` TEXT NOT NULL,
    `add_time` TEXT NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `collection`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `order_id` REAL NOT NULL,
    `name` TEXT NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `bookmark_collection`(
    `id` INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `bookmark_id` INTEGER NOT NULL,
    `collection_id` INTEGER NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`collection_id`) REFERENCES `collection`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION,
    FOREIGN KEY(`bookmark_id`) REFERENCES `bookmark`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);
CREATE UNIQUE INDEX IF NOT EXISTS `bookmark_collection_bookmark_id_collection_id` ON
    `bookmark_collection`(`bookmark_id`, `collection_id`);
