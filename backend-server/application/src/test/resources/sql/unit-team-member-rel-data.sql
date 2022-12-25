-- APITable <https://github.com/apitable/apitable>
-- Copyright (C) 2022 APITable Ltd. <https://apitable.com>
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program.  If not, see <http://www.gnu.org/licenses/>.

-- related unit-team-member: 41, Related unit-team: 41.
-- impact test: MemberMapperTest：testSelectUserIdByTeamId、selectMembersByTeamId
INSERT INTO `unit_team_member_rel` (`id`, `team_id`, `member_id`)
VALUES (41, 41, 41);

-- related unit-team-member：45,with the associated unit team 45
-- Impact test:TeamMapperTest.testSelectTeamsByIds
INSERT INTO `unit_team_member_rel` (`id`, `team_id`, `member_id`)
VALUES (45, 45, 45);