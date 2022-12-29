CREATE TABLE `${table.prefix}social_tenant`
(
    `id`                 bigint(20) unsigned                     NOT NULL COMMENT '主键',
    `app_id`             varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '应用标识',
    `app_type`           tinyint(2) unsigned                     NOT NULL COMMENT '应用类型(1: 企业内部应用, 2: 独立服务商)',
    `tenant_id`          varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '企业的唯一标识，各大平台名词不一致，这里统一使用租户表示',
    `contact_auth_scope` json                                             DEFAULT NULL COMMENT '通讯录权限范围',
    `platform`           tinyint(2) unsigned                     NOT NULL COMMENT '所属平台(1: 企业微信, 2: 钉钉, 3: 飞书)',
    `status`             tinyint(1) unsigned                     NOT NULL DEFAULT '1' COMMENT '状态(0: 停用, 1: 启用)',
    `created_at`         timestamp                               NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`         timestamp                               NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_app_tenant` (`app_id`, `tenant_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方平台集成-企业租户表';