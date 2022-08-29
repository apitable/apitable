CREATE TABLE `vika_player_answer`
(
    `id`            bigint(20) unsigned                                           NOT NULL COMMENT '主键',
    `question_id`   int(10)                                                       NOT NULL COMMENT '问题ID',
    `question_desc` varchar(511) COLLATE utf8mb4_unicode_ci                                DEFAULT NULL COMMENT '问题描述',
    `answer`        varchar(511) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '答案',
    `answerer`       varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT '[冗余]回复者名称',
    `created_by`    bigint(20)                                                             DEFAULT NULL COMMENT '创建者',
    `created_at`    timestamp                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='玩家系统-问卷调查答案表';
