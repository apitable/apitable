-- 同个用户(id=1)有多个相同的第三方关联
INSERT INTO `vika_user_link` (`id`, `user_id`, `open_id`, `union_id`,
                              `nick_name`, `type`)
VALUES (1, 1, 'ou_52bfd39d2ce240c46be3b9d8b6b84557',
        'on_d95ea1a7a3bc2a60d1f11cb592c8a3e5', '邓贵恒', 3),
       (2, 1, 'ou_b2aacf6c36e61301fb8f4a3fc8c49d8e',
        'on_7494a6de87323d9eb1d04b7803691396', '邓贵恒', 3);