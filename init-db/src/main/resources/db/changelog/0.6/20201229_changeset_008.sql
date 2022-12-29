CREATE TABLE `${table.prefix}social_user_bind`
(
    `id`         bigint(20) unsigned                                           NOT NULL COMMENT '主键',
    `user_id`    bigint(20) unsigned                                           NOT NULL COMMENT '维格用户ID',
    `union_id`   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户在平台唯一标识',
    `created_at` timestamp                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp                                                     NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_user_union` (`user_id`, `union_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方平台集成-用户绑定表';