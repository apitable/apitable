ALTER TABLE `${table.prefix}node_share_setting`
    ADD COLUMN `view_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分享视图ID' AFTER `node_id`;
