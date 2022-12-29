CREATE TABLE `${table.prefix}social_tenant_bind`
(
    `id`                   bigint(20) unsigned                     NOT NULL COMMENT '主键',
    `space_id`             varchar(50) COLLATE utf8mb4_unicode_ci  NOT NULL COMMENT '维格空间站ID',
    `tenant_id`            varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业的唯一标识，各大平台名词不一致，这里统一使用租户表示',
    `tenant_department_id` varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '企业的对应部门ID',
    `created_by`           bigint(20)                                       DEFAULT NULL COMMENT '创建者',
    `updated_by`           bigint(20)                                       DEFAULT NULL COMMENT '最后修改者',
    `created_at`           timestamp                               NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`           timestamp                               NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_space_tenant_bind` (`space_id`, `tenant_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方平台集成-企业租户绑定空间表';