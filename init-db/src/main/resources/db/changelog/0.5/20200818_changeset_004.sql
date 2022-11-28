CREATE TABLE `${table.prefix}code_activity`
(
    `id`         bigint(20) unsigned                                           NOT NULL COMMENT '主键',
    `name`       varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '活动名称',
    `scene`      varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci           DEFAULT NULL COMMENT '场景值',
    `is_deleted` tinyint(1) unsigned                                           NOT NULL DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by` bigint(20)                                                             DEFAULT NULL COMMENT '创建者',
    `updated_by` bigint(20)                                                             DEFAULT NULL COMMENT '最后修改者',
    `created_at` timestamp                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp                                                     NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_scene` (`scene`) USING BTREE COMMENT '唯一场景值'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='V码系统-活动表';
