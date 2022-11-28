CREATE TABLE `${table.prefix}api_usage`
(
    `id`          bigint(20) unsigned                                          NOT NULL COMMENT '主键',
    `user_id`     bigint(20) unsigned                                          NOT NULL COMMENT '用户ID',
    `dst_id`      varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '数表ID(关联#vika_datasheet#dst_id)',
    `req_path`    varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'api的path,域名后面的数据，不包括query数据',
    `req_method`  tinyint(2) unsigned                                          NOT NULL DEFAULT '1' COMMENT 'api请求方式1 get 2 post 3 patch 4 put',
    `api_version` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'api版本',
    `req_ip`      varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '客户端IP',
    `req_detail`  json                                                         NOT NULL COMMENT 'api调用详细信息,包括ua,refer等信息',
    `res_detail`  json                                                         NOT NULL COMMENT 'api调用返回信息，包括code,message等',
    `created_at`  timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_user_id` (`user_id`),
    KEY `idx_dst_id` (`dst_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='开放平台-api请求信息记录表';
