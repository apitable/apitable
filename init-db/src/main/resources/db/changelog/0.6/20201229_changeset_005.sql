CREATE TABLE `${table.prefix}social_tenant_department_bind`
(
    `id`                   bigint(20) unsigned NOT NULL COMMENT '主键',
    `space_id`             varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  DEFAULT NULL COMMENT '空间站标识',
    `team_id`              bigint(20)                                                    DEFAULT NULL COMMENT '空间站通讯录小组ID',
    `tenant_id`            varchar(255) COLLATE utf8mb4_unicode_ci                       DEFAULT NULL COMMENT '租户标识',
    `tenant_department_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '租户下的部门唯一标识',
    `created_at`           timestamp           NOT NULL                                  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`           timestamp           NULL                                      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方平台集成-企业租户部门关联表';