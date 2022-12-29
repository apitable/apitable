CREATE TABLE `${table.prefix}integral_history`
(
    `id`              bigint(20)                                                   NOT NULL COMMENT '主键',
    `user_id`         bigint(20)                                                   NOT NULL COMMENT '用户表',
    `action_code`     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '积分操作代码',
    `origin_integral` int(11) unsigned                                             NOT NULL COMMENT '原积分值',
    `alter_type`      tinyint(2) unsigned                                          NOT NULL DEFAULT '0' COMMENT '变更类型(0:收入,1:支出)',
    `alter_integral`  int(11) unsigned                                             NOT NULL COMMENT '变更积分值',
    `total_integral`  int(11) unsigned                                             NOT NULL COMMENT '变更剩余总积分值',
    `created_by`      bigint(20) unsigned                                          NOT NULL COMMENT '创建者',
    `updated_by`      bigint(20) unsigned                                          NOT NULL COMMENT '最后修改者',
    `created_at`      timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`      timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='积分系统-积分变更历史表';
