CREATE TABLE `${table.prefix}social_feishu_event_log`
(
    `id`         bigint(20) unsigned                                           NOT NULL COMMENT '主键',
    `app_id`     varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '应用标识',
    `tenant_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业标识',
    `uuid`       varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  NOT NULL COMMENT '事件唯一标识',
    `ts`         varchar(255) COLLATE utf8mb4_unicode_ci                                DEFAULT NULL COMMENT '事件发送的时间',
    `type`       varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '事件类型',
    `event_data` json                                                                   DEFAULT NULL COMMENT '事件内容',
    `status`     tinyint(1) unsigned                                                    DEFAULT '0' COMMENT '是否已处理(0:否,1:是)',
    `created_at` timestamp                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp                                                     NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_uuid` (`uuid`) COMMENT 'UUID唯一'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方平台集成-飞书事件日志表';