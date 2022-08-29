CREATE TABLE `vika_datasheet_widget`
(
    `id`         bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `space_id`   varchar(50) COLLATE utf8mb4_unicode_ci                       NOT NULL COMMENT '空间ID',
    `dst_id`     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数表ID(关联#vika_datasheet#dst_id)',
    `widget_id`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '自定组件ID',
    `created_at` timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `k_dst_id` (`dst_id`) USING BTREE,
    KEY `k_widget_id` (`widget_id`) USING BTREE,
    KEY `k_space_id` (`space_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作台-数表组件关联表';
