CREATE TABLE `${table.prefix}resource_changeset`
(
    `id`          bigint(20) unsigned NOT NULL COMMENT '主键',
    `resource_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  DEFAULT NULL COMMENT '资源ID(node_id/widget_id/..)',
    `message_id`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'changeset请求的唯一标识，用于保证changeset的唯一',
    `operations`  longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '操作action的合集',
    `revision`    bigint(20) unsigned                                           DEFAULT '0' COMMENT '版本号',
    `source_type` tinyint(2) unsigned                                           DEFAULT '0' COMMENT '数据来源类型(0:默认)',
    `created_by`  bigint(20)                                                    DEFAULT NULL COMMENT '创建用户',
    `created_at`  timestamp           NOT NULL                                  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_rsc_msg_id` (`resource_id`, `message_id`) USING BTREE,
    UNIQUE KEY `uk_rsc_rvs` (`resource_id`, `revision`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作台-资源操作变更合集表';
