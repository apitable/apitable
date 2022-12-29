CREATE TABLE `${table.prefix}control`
(
    `id`           bigint(20) unsigned                                           NOT NULL COMMENT '主键',
    `space_id`     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  NOT NULL COMMENT '空间ID',
    `control_id`   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '资源控制标识',
    `control_type` tinyint(1) unsigned                                           NOT NULL DEFAULT '0' COMMENT '资源控制类型(0:工作台节点ID,1:数表字段,2:数表视图)',
    `unit_id`      bigint(20) unsigned                                           NOT NULL COMMENT '组织单元ID',
    `role_code`    varchar(50)                                                   NOT NULL COMMENT '角色编码',
    `created_by`   bigint(20)                                                             DEFAULT NULL COMMENT '创建者',
    `updated_by`   bigint(20)                                                             DEFAULT NULL COMMENT '最后修改者',
    `created_at`   timestamp                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`   timestamp                                                     NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `control_id_index` (`control_id`(18)) USING BTREE,
    KEY `k_space_id` (`space_id`) USING BTREE COMMENT '空间ID索引'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = '工作台-权限控制表';
