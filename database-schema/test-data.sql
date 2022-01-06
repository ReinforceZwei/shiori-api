INSERT INTO `user` (name, password) VALUES
    ('reinforce', '-');

INSERT INTO `bookmark` (user_id, order_id, name, url, add_time) VALUES
    (1, 10, 'Facebook', 'https://facebook.com', NOW()),
    (1, 20, 'Discord', 'https://discord.com', NOW()),
    (1, 30, 'Google', 'https://google.com', NOW()),
    (1, 40, 'DuckDuckGo', 'https://ddg.gg', NOW());

INSERT INTO `collection` (user_id, order_id, name) VALUES
    (1, 10, 'Social media');

INSERT INTO `bookmark_collection` (user_id, bookmark_id, collection_id) VALUES
    (1, 1, 1),
    (1, 2, 1);