CREATE TABLE `vika_code_usage`
(
    `id`            bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `type`          tinyint(2) unsigned                                          NOT NULL COMMENT '类型(0:领取;1:使用)',
    `code`          varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'V码',
    `operator`      bigint(20)                                                            DEFAULT NULL COMMENT '操作者ID(第三方会员ID/用户ID)',
    `operator_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '[冗余]操作者名称',
    `created_at`    timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_code` (`code`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='V码系统-V码记录表';
