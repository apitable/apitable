CREATE TABLE `vika_datasheet_record_comment`
(
    `id`          bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `dst_id`      varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数表ID',
    `record_id`   varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '记录ID',
    `comment_id`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'chengeset生成的comment_id',
    `comment_msg` json                                                         NOT NULL COMMENT '评论富文本内容',
    `revision`    bigint(20) unsigned                                                   DEFAULT '0' COMMENT '记录版本号',
    `is_deleted`  tinyint(1) unsigned                                                   DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `member_id`   bigint(20)                                                            DEFAULT NULL COMMENT '[冗余]操作成员ID(关联#vika_unit_member#id)',
    `created_by`  bigint(20)                                                            DEFAULT NULL COMMENT '创建者',
    `updated_by`  bigint(20)                                                            DEFAULT NULL COMMENT '最后修改者',
    `created_at`  timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`  timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_dst_id` (`dst_id`) USING BTREE,
    KEY `idx_record_id` (`record_id`) USING BTREE,
    KEY `idx_comment_id` (`comment_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作台-数表记录评论表';
