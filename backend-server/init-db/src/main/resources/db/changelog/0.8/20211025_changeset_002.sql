CREATE TABLE `vika_labs_features`
(
      `id`          bigint(20) unsigned NOT NULL                                                        COMMENT '主键',
      `feature_key` varchar(255)        NOT NULL                                                        COMMENT '实验室功能唯一标识',
      `type`        tinyint(2)          NOT NULL                                                        COMMENT '实验室功能的类型(static:不准操作, review:可申请，normal:可正常开关)',
      `url`         varchar(1024)       DEFAULT NULL                                                    COMMENT '实验功能申请表单地址',
      `created_at`  timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP                              COMMENT '数据创建时间',
      `updated_at`  timestamp               NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  COMMENT '数据修改时间',
      PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci COMMENT = '实验性功能表';