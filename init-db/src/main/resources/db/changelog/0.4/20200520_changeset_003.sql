-- 内容举报记录表
CREATE TABLE `${table.prefix}content_censor_report`
(
    `id`            bigint(20)                             NOT NULL COMMENT '主键',
    `user_id`       bigint(20) unsigned                             DEFAULT NULL COMMENT '举报者用户ID(关联#vika_user#id)',
    `node_id`       varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '节点ID',
    `report_reason` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '举报原因',
    `created_at`    timestamp                              NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    timestamp                              NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='内容举报记录表';
