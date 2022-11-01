-- The same user (id=1) has multiple identical third-party associations
INSERT INTO `vika_user_link` (`id`, `user_id`, `open_id`, `union_id`,
                              `nick_name`, `type`)
VALUES (1, 1, 'ou_52bfd39d2ce240c46be3b9d8b6b84557',
        'on_d95ea1a7a3bc2a60d1f11cb592c8a3e5', 'ShawnDeng', 3),
       (2, 1, 'ou_b2aacf6c36e61301fb8f4a3fc8c49d8e',
        'on_7494a6de87323d9eb1d04b7803691396', 'ShawnDeng', 3);