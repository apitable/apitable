CREATE TABLE `vika_widget`
(
    `id`         bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `dst_id`     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数表ID(关联#vika_datasheet#dst_id)',
    `package_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '组件包ID(关联#vika_widget_package#package_id)',
    `widget_id`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '自定组件ID',
    `name`       varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '名称',
    `storage`    json                                                                  DEFAULT NULL COMMENT '存储配置',
    `revision`   bigint(20) unsigned                                                   DEFAULT '0' COMMENT '版本号',
    `is_deleted` tinyint(1) unsigned                                          NOT NULL DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by` bigint(20)                                                            DEFAULT NULL COMMENT '创建者',
    `updated_by` bigint(20)                                                            DEFAULT NULL COMMENT '最后修改者',
    `created_at` timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_widget_id` (`widget_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作台-组件表';
