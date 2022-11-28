CREATE TABLE `${table.prefix}wechat_keyword_reply`
(
    `id`         bigint(20) unsigned NOT NULL COMMENT '主键',
    `app_id`     varchar(50)         NOT NULL COMMENT '公众号Appid（关联#vika_wechat_authorization#authorizer_appid）',
    `rule_name`  varchar(255)        NOT NULL COMMENT '规则名称',
    `match_mode` varchar(50)         NOT NULL COMMENT '关键词匹配模式，contain代表消息中含有该关键词即可，equal表示消息内容必须和关键词严格相同',
    `reply_mode` varchar(50)         NOT NULL COMMENT '回复模式，reply_all代表全部回复，random_one代表随机回复其中一条 ',
    `keyword`    varchar(100)        NOT NULL COMMENT '关键词，对于文本类型，content是文本内容，对于图文、图片、语音、视频类型，content是mediaID',
    `type`       varchar(10)         NOT NULL COMMENT '自动回复的类型，关注后自动回复和消息自动回复的类型仅支持文本（text）、图片（img）、语音（voice）、视频（video），关键词自动回复则还多了图文消息（news）',
    `news_info`  json                         DEFAULT NULL COMMENT '图文消息的回复内容',
    `created_at` timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp           NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='第三方系统-微信关键词消息自动回复表';
