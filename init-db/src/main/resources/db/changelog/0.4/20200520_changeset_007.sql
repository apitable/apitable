CREATE TABLE `vika_template`
(
    `id`            bigint(20) unsigned NOT NULL COMMENT '主键',
    `node_id`       varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  DEFAULT NULL COMMENT '模板的本质是映射一个静态的node及其数据',
    `type`          tinyint(2) unsigned NOT NULL COMMENT '模版类型(0:PreInstall官方预装,1:Space用户空间站自己的,2:Marketplace发布到市场，属于Sku的一部分)',
    `type_id`       varchar(255)        NOT NULL COMMENT '对应类型标识(官方预装/Space编号/SKU)',
    `category_name` varchar(255)                                                  DEFAULT NULL COMMENT '分类名称',
    `name`          varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '模板名称',
    `used_times`    int(10) UNSIGNED    NOT NULL                                  DEFAULT 0 COMMENT '使用次数',
    `is_deleted`    tinyint(1) unsigned NOT NULL                                  DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by`    bigint(20)                                                    DEFAULT NULL COMMENT '创建者',
    `updated_by`    bigint(20)                                                    DEFAULT NULL COMMENT '最后修改者',
    `created_at`    timestamp           NOT NULL                                  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    timestamp           NULL                                      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='模板中心-模版表';
