CREATE TABLE `${table.prefix}player_notification`
(
    `id`          bigint(20) UNSIGNED NOT NULL COMMENT '主键',
    `space_id`    varchar(32)                  DEFAULT NULL COMMENT '空间ID',
    `from_user`   bigint(20)          NOT NULL DEFAULT 0 COMMENT '发送用户，如果为0 这是系统用户',
    `to_user`     bigint(20)          NOT NULL COMMENT '接收用户',
    `node_id`     varchar(32)                  DEFAULT NULL COMMENT '节点ID(冗余字段)',
    `template_id` varchar(50)         NOT NULL COMMENT '通知模版ID',
    `notify_type` varchar(10)         NOT NULL DEFAULT 0 COMMENT '通知类型',
    `notify_body` json                         DEFAULT NULL COMMENT '通知消息体',
    `is_read`     tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已读(0:否,1:是)',
    `is_deleted`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '删除标记(0:否,1:是)',
    `created_at`  timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`  timestamp           NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_user_type` (`to_user`, `notify_type`) USING BTREE
) ENGINE = INNODB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = '通知中心-通知记录表';
