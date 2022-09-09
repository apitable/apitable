CREATE TABLE `vika_developer_applet`
(
    `id`            bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `space_id`      varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '关联的工作间SpaceId',
    `applet_id`     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类似其它开放平台的appId,全局唯一',
    `applet_secret` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '秘钥，一般都被半隐藏，可被重置',
    `is_deleted`    tinyint(1) unsigned                                          NOT NULL DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by`    bigint(20)                                                            DEFAULT NULL COMMENT '创建者',
    `updated_by`    bigint(20)                                                            DEFAULT NULL COMMENT '最后修改者',
    `created_at`    timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_applet_id` (`applet_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='开放平台-云程序表';
