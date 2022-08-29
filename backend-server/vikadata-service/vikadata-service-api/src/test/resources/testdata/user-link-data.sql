-- 同个用户(id=1)有多个第三方关联(4种类型)
INSERT INTO `vika_user_link` (`id`, `user_id`, `open_id`, `union_id`,
                              `nick_name`, `type`)
VALUES (1, 1, 'ou_52bfd39d2ce240c46be3b9d8b6b84557',
        'on_d95ea1a7a3bc2a60d1f11cb592c8a3e5', '邓贵恒', 3),
       (2, 1, 'DDC8567B5644A0FEA4685F93E4EA1AA5',
        'UID_9EB9ED7B5A47472DFCAAF3CC8DDD747E', '邓贵恒', 2),
       (3, 1, '15671701181046575',
        'JpTv4X1Wvl2rRyMBRgC08AiEiE', '邓贵恒', 0),
       (4, 1, NULL, 'oUm3Vvyz_NFGV2XLaiPTX8V_1aNM', '中国🇨🇳队长😁', 1);

INSERT INTO `vika_user_link` (`id`, `user_id`, `open_id`, `union_id`,
                              `nick_name`, `type`)
VALUES (41, 41, 'oi41', 'ui41', 'vika body', 0);