ALTER table vika_widget
    ADD COLUMN `space_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '空间ID' AFTER `id`,
    ADD INDEX `k_space_id` (`space_id`) USING BTREE;
