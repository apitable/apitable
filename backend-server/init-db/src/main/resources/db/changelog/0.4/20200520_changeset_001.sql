-- 开放者平台表
CREATE TABLE `vika_developer`
(
    `id`         bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `user_id`    bigint(20) unsigned                                          NOT NULL COMMENT '用户ID',
    `api_key`    varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '开发者平台唯一令牌',
    `created_by` bigint(20) unsigned                                          NOT NULL COMMENT '创建者',
    `updated_by` bigint(20) unsigned                                          NOT NULL COMMENT '最后修改者',
    `created_at` timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='开放平台-开发者配置表';
