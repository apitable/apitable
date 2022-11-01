-- related unit-team-member: 41, Related unit-team: 41.
-- impact test: MemberMapperTest：testSelectUserIdByTeamId、selectMembersByTeamId
INSERT INTO `vika_unit_team_member_rel` (`id`, `team_id`, `member_id`)
VALUES (41, 41, 41);

-- related unit-team-member：45,with the associated unit team 45
-- Impact test:TeamMapperTest.testSelectTeamsByIds
INSERT INTO `vika_unit_team_member_rel` (`id`, `team_id`, `member_id`)
VALUES (45, 45, 45);