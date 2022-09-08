CREATE TABLE `vika_content_censor_result`
(
    `id`                 bigint                                                       NOT NULL COMMENT '主键',
    `node_id`            varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '节点ID',
    `report_num`         bigint unsigned                                              NOT NULL DEFAULT '0' COMMENT '举报次数',
    `report_result`      tinyint unsigned                                             NOT NULL DEFAULT '0' COMMENT '处理结果(0:未处理，1:封禁，2:正常（解封）)',
    `auditor_dt_user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '审核人钉钉用户ID',
    `auditor_dt_name`    varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '审核人钉钉名称',
    `created_at`         timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`         timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `Idx_Node_id` (`node_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='内容审核结果记录表';
