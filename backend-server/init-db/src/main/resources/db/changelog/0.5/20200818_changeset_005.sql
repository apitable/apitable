CREATE TABLE `vika_code`
(
    `id`              bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `type`            tinyint(2) unsigned                                          NOT NULL COMMENT '类型(0:官方邀请码;1:个人邀请码;2:兑换码)',
    `activity_id`     bigint(20)                                                            DEFAULT NULL COMMENT '活动ID(关联#vika_code_activity#id)',
    `ref_id`          bigint(20)                                                            DEFAULT NULL COMMENT '关联ID(第三方会员ID/用户ID/兑换模板ID)',
    `code`            varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'V码',
    `available_times` int(10)                                                               DEFAULT NULL COMMENT '可使用总数',
    `remain_times`    int(10)                                                               DEFAULT NULL COMMENT '剩余次数',
    `limit_times`     int(10)                                                               DEFAULT NULL COMMENT '单人限制使用次数',
    `expired_at`      timestamp                                                    NULL     DEFAULT NULL COMMENT '过期时间',
    `assign_user_id`  bigint(20)                                                            DEFAULT NULL COMMENT '指定使用者用户ID',
    `is_deleted`      tinyint(1) unsigned                                          NOT NULL DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by`      bigint(20)                                                            DEFAULT NULL COMMENT '创建者',
    `updated_by`      bigint(20)                                                            DEFAULT NULL COMMENT '最后修改者',
    `created_at`      timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`      timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_code` (`code`) USING BTREE COMMENT 'V码唯一编码'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='V码系统-V码表';
