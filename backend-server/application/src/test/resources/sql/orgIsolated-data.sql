-- APITable <https://github.com/apitable/apitable>
-- Copyright (C) 2022 APITable Ltd. <https://apitable.com>
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY: without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program.  If not, see <http://www.gnu.org/licenses/>.

INSERT INTO `space` (`id`, `space_id`, `name`, `props`)
VALUES (1236155491621539841, 'spczdmQDfBAn5', 'Space', '{\"orgIsolated\": 1}');

INSERT INTO `unit_team` (`id`, `space_id`, `parent_id`, `team_name`, `team_level`, `sequence`)
VALUES (1236155491650899970, 'spczdmQDfBAn5', 0, 'Space', 1, 1),
       (1236159916641619970, 'spczdmQDfBAn5', 1236155491650899970, 'Engineering', 1, 1),
       (1236159923558027266, 'spczdmQDfBAn5', 1236155491650899970, 'Product', 1, 2),
       (1283285207447699457, 'spczdmQDfBAn5', 1236155491650899970, 'Marketing', 1, 4),
       (1279306279580438529, 'spczdmQDfBAn5', 1236159916641619970, 'UX Engineering', 1, 1),
       (1279306845094252545, 'spczdmQDfBAn5', 1236159916641619970, 'BackendEngineering', 1, 2),
       (1424627977210224641, 'spczdmQDfBAn5', 1236159916641619970, 'Quality Engineering', 1, 3),
       (1481090465825501186, 'spczdmQDfBAn5', 1236159916641619970, 'Mobile Engineering', 1, 4),
       (1498207615168450561, 'spczdmQDfBAn5', 1236159916641619970, 'Infra', 1, 5),
       (1342304314473648129, 'spczdmQDfBAn5', 1236159923558027266, 'Product Community', 1, 1),
       (1348518395039653890, 'spczdmQDfBAn5', 1236159923558027266, 'Product Platform', 1, 2),
       (1348518430007566337, 'spczdmQDfBAn5', 1236159923558027266, 'Product Design', 1, 3),
       (1499491659373031234, 'spczdmQDfBAn5', 1279306845094252545, 'BackendEngineering one', 1, 3);

INSERT INTO `unit_member` (`id`, `user_id`, `space_id`)
VALUES (1478202310895792130, 1478241862259765250, 'spczdmQDfBAn5'),
       (1478202310895792131, 1478241862259765251, 'spczdmQDfBAn5');

INSERT INTO `unit_team_member_rel` (`id`, `team_id`, `member_id`)
VALUES (1481090743970771234, 1279306279580438529, 1478202310895792130),
       (1481090743970774567, 1342304314473648129, 1478202310895792130),
       (1481090743970776789, 1236159916641619970, 1478202310895792130),
       (1481090743970779876, 1283285207447699457, 1478202310895792130),
       (1481090743970779877, 1236155491650899970, 1478202310895792131);