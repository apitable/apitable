CREATE TABLE `vika_wechat_mp_qrcode`
(
    `id`             bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `app_id`         varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '应用 appid',
    `type`           varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型值(临时:QR_SCENE、QR_STR_SCENE;永久:QR_LIMIT_SCENE、QR_LIMIT_STR_SCENE)',
    `scene`          varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '场景值',
    `ticket`         varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '二维码ticket，有效时间内可换取二维码',
    `expire_seconds` int(10)                                                               DEFAULT NULL COMMENT '二维码有效时间(单位：秒，-1表示永久)',
    `url`            varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci         DEFAULT NULL COMMENT '二维码图片解析后的地址，可自行生成图片',
    `is_deleted`     tinyint(1) unsigned                                          NOT NULL DEFAULT '0' COMMENT '删除标记(0:否,1:是)',
    `created_by`     bigint(20)                                                            DEFAULT NULL COMMENT '创建者',
    `updated_by`     bigint(20)                                                            DEFAULT NULL COMMENT '最后修改者',
    `created_at`     timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`     timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方系统-微信公众号二维码信息表';
