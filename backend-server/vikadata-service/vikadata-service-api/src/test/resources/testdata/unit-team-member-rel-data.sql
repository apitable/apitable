-- 有关联的unit-team-member：41，有关联的unit-team：41。
-- 影响测试：MemberMapperTest：testSelectUserIdByTeamId、selectMembersByTeamId
INSERT INTO `vika_unit_team_member_rel` (`id`, `team_id`, `member_id`)
VALUES (41, 41, 41);

-- 有关联的unit-team-member：45，有关联的unit-team：45
-- 影响测试：TeamMapperTest.testSelectTeamsByIds
INSERT INTO `vika_unit_team_member_rel` (`id`, `team_id`, `member_id`)
VALUES (45, 45, 45);