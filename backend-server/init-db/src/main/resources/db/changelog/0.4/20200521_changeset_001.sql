ALTER TABLE vika_node
    add COLUMN `is_banned` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否封禁(0:否,1:是)' AFTER `is_deleted`;
