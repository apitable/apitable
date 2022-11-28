ALTER TABLE `${table.prefix}widget`
    ADD COLUMN `node_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '节点ID' AFTER `space_id`;
