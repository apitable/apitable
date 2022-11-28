ALTER TABLE `${table.prefix}node`
    ADD COLUMN `is_rubbish` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '回收站标记(0:否,1:是)' AFTER `is_deleted`;
