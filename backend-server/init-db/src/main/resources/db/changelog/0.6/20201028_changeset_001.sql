CREATE TABLE `vika_space_apply`
(
    `id`             bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `space_id`       varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '空间ID(关联#vika_space#space_id)',
    `status`         tinyint(2) unsigned                                                   DEFAULT '0' COMMENT '状态(0:待审核;1:同意;2:拒绝;3:失效)',
    `failure_reason` tinyint(2) unsigned                                                   DEFAULT NULL COMMENT '失效原因(0:邮箱邀请;1:邀请链接;2:通讯录导入)',
    `created_by`     bigint(20)                                                            DEFAULT NULL COMMENT '创建者',
    `updated_by`     bigint(20)                                                            DEFAULT NULL COMMENT '最后修改者',
    `created_at`     timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`     timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作空间-申请表';
