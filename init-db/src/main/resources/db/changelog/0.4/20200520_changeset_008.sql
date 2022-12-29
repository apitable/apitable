CREATE TABLE `${table.prefix}marketplace_sku`
(
    `id`         bigint(20) unsigned NOT NULL COMMENT '主键',
    `type`       tinyint(2) unsigned NOT NULL COMMENT '0:Template模板，1:Applet云程序',
    `type_id`    bigint(20)                   DEFAULT NULL COMMENT '对应type的关联编号',
    `product_id` bigint(20)                   DEFAULT NULL COMMENT '对应SPU(Product)的关联编号',
    `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by` bigint(20)                   DEFAULT NULL COMMENT '创建者',
    `updated_by` bigint(20)                   DEFAULT NULL COMMENT '最后修改者',
    `created_at` timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp           NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='开放平台-SKU表';
