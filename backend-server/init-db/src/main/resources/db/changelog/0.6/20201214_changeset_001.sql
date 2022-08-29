CREATE TABLE `vika_widget_package`
(
    `id`            bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `package_id`    varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '组件包ID',
    `name`          varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '名称',
    `name_en`       varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '英文名称',
    `icon`          varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '图标',
    `description`   text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '描述',
    `status`        tinyint(2) unsigned                                          NOT NULL DEFAULT '0' COMMENT '状态(0:待审核;1:不通过;2:待发布;3:已上线;4:已下架)',
    `version`       varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '版本',
    `installed_num` int(10) unsigned                                             NOT NULL DEFAULT '0' COMMENT '安装次数',
    `is_deleted`    tinyint(1) unsigned                                          NOT NULL DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by`    bigint(20)                                                            DEFAULT NULL COMMENT '创建者',
    `updated_by`    bigint(20)                                                            DEFAULT NULL COMMENT '最后修改者',
    `created_at`    timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_package_id` (`package_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='工作台-组件包信息表';
