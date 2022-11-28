INSERT INTO `player_notification` (`id`, `space_id`, `from_user`, `to_user`,
                                        `node_id`, `template_id`, `notify_type`, `notify_body`,
                                        `is_read`)
VALUES (41, 'spc41', 45, 41, 41,
        'assigned_to_group', 'member', '{"key": "value"}', 1);

INSERT INTO `player_notification` (`id`, `space_id`, `from_user`, `to_user`,
                                        `node_id`, `template_id`, `notify_type`, `notify_body`,
                                        `is_read`)
VALUES (45, 'spc41', 45, 41, 41,
        'assigned_to_group', 'member', '{"id": 45, "status": 0}', 1);