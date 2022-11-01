-- team 41 is the top unit
INSERT INTO `vika_unit_team` (`id`, `space_id`, `parent_id`, `team_name`, `team_level`,
                              `sequence`)
VALUES (41, 'spc41', 0, 'team41', 1, 1);

-- The parent unit of team 45 is team 41.
INSERT INTO `vika_unit_team` (`id`, `space_id`, `parent_id`, `team_name`, `team_level`,
                              `sequence`)
VALUES (45, 'spc41', 41, 'team45', 2, 1);