-- team41为顶级单位
INSERT INTO `vika_unit_team` (`id`, `space_id`, `parent_id`, `team_name`, `team_level`,
                              `sequence`)
VALUES (41, 'spc41', 0, '维格', 1, 1);

-- team45的父单位为team41。
INSERT INTO `vika_unit_team` (`id`, `space_id`, `parent_id`, `team_name`, `team_level`,
                              `sequence`)
VALUES (45, 'spc41', 41, '研发部', 2, 1);