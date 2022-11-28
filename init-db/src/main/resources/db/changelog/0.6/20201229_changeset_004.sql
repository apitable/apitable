CREATE TABLE `${table.prefix}social_tenant_department`
(
    `id`                        bigint(20) unsigned                     NOT NULL COMMENT '主键',
    `tenant_id`                 varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业标识',
    `space_id`                  varchar(50) COLLATE utf8mb4_unicode_ci           DEFAULT NULL COMMENT '企业绑定的空间站标识',
    `department_id`             varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '部门ID',
    `open_department_id`        varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '部门 open ID',
    `parent_id`                 varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '父部门 ID',
    `parent_open_department_id` varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '父部门 open ID',
    `department_name`           varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '部门名称',
    `created_at`                timestamp                               NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`                timestamp                               NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `k_tenant_id` (`tenant_id`) COMMENT '租户索引'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方平台集成-企业租户部门表';