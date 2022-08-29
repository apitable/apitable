CREATE TABLE `vika_resource_meta`
(
    `id`          bigint(20) unsigned NOT NULL COMMENT '主键',
    `resource_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '资源ID(node_id/..)',
    `meta_data`   json                                                         DEFAULT NULL COMMENT '元数据',
    `revision`    bigint(20) unsigned NOT NULL                                 DEFAULT '0' COMMENT '版本号',
    `is_deleted`  tinyint(1) unsigned NOT NULL                                 DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by`  bigint(20)                                                   DEFAULT NULL COMMENT '创建用户',
    `updated_by`  bigint(20)                                                   DEFAULT NULL COMMENT '最后一次更新用户',
    `created_at`  timestamp           NOT NULL                                 DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`  timestamp           NULL                                     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `uk_resource_id` (`resource_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作台-资源元数据表';
