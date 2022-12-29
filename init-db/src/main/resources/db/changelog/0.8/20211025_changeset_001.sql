CREATE TABLE `${table.prefix}labs_applicant`
(
   `id`             bigint(20) unsigned NOT NULL                                                       COMMENT '主键',
   `applicant_type` tinyint(2) unsigned NOT NULL                                                       COMMENT '申请者类型(0:user_feature, 1:space_feature)',
   `applicant`      varchar(100)        NOT NULL                                                       COMMENT '申请者Id,可以是spaceId或者userId',
   `feature_key`    varchar(255)        NOT NULL                                                       COMMENT '实验性功能标识',
   `is_deleted`     tinyint(1) unsigned NOT NULL                                                       COMMENT '删除标记(0:否, 1:是)',
   `created_at`     timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP                             COMMENT '数据记录创建时间',
   `updated_at`     timestamp           NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '数据记录修改时间',
   PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci COMMENT = '实验性功能内测申请表';