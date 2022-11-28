CREATE TABLE `${table.prefix}social_user`
(
    `id`         bigint(20) unsigned                                           NOT NULL COMMENT '主键',
    `union_id`   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户在平台唯一标识',
    `platform`   tinyint(2) unsigned                                           NOT NULL COMMENT '所属平台(1: 企业微信, 2: 钉钉, 3: 飞书)',
    `created_at` timestamp                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp                                                     NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_platform_union_id` (`union_id`, `platform`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方平台集成-用户表';