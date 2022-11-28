CREATE TABLE `${table.prefix}marketplace_product`
(
    `id`          bigint(20) unsigned NOT NULL COMMENT '主键',
    `name`        varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '商品名称',
    `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '商品介绍',
    `is_deleted`  tinyint(1) unsigned NOT NULL                                  DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by`  bigint(20)                                                    DEFAULT NULL COMMENT '创建者',
    `updated_by`  bigint(20)                                                    DEFAULT NULL COMMENT '最后修改者',
    `created_at`  timestamp           NOT NULL                                  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`  timestamp           NULL                                      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='开放平台-商品表';
