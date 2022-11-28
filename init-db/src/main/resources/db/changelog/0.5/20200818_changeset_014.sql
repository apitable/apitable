CREATE TABLE `${table.prefix}kb_account_user`
(
    `id`            bigint(20)                                                   NOT NULL COMMENT '主键',
    `user_id`       bigint(20)                                                   NOT NULL COMMENT '维格用户ID',
    `kb_account_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'killbill对应账户标识',
    `created_by`    bigint(20) unsigned                                          NOT NULL COMMENT '创建者',
    `updated_by`    bigint(20) unsigned                                          NOT NULL COMMENT '最后修改者',
    `created_at`    timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='订阅管理-killbill客户用户表';
