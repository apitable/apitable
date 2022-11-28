CREATE TABLE `${table.prefix}node_favorite`
(
    `id`          bigint(20)                                                   NOT NULL COMMENT '主键',
    `space_id`    varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '空间ID(关联#vika_space#space_id)',
    `member_id`   bigint(20)                                                   NOT NULL COMMENT '成员ID(关联#vika_unit_member#id)',
    `pre_node_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '前置节点ID',
    `node_id`     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '自定义节点ID',
    `created_at`  timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `fk_member_id` (`member_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作台-节点收藏表';
