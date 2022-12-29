ALTER TABLE `${table.prefix}node`
    ADD COLUMN `cover`       varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL     DEFAULT NULL COMMENT '封面图TOKEN' AFTER `type`,
    ADD COLUMN `is_template` tinyint(1) UNSIGNED                                           NOT NULL DEFAULT 0 COMMENT '是否模版(0:否,1:是)' AFTER `cover`;
