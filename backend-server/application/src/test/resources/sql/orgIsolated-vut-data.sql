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

INSERT INTO `unit_team` (`id`, `space_id`, `parent_id`, `team_name`, `team_level`, `sequence`, `is_deleted`, `created_at`, `updated_at`)
VALUES (1236155491650899970, 'spczdmQDfBAn5', 0, 'Space', 1, 1, 0, '2020-03-07 13:03:30', '2021-05-27 18:49:03'),
       (1236159916641619970, 'spczdmQDfBAn5', 1236155491650899970, 'Engineering', 1, 1, 0, '2020-03-07 13:21:05', '2022-03-01 14:50:20'),
       (1236159923558027266, 'spczdmQDfBAn5', 1236155491650899970, 'Product', 1, 2, 0, '2020-03-07 13:21:07', '2022-03-01 14:50:13'),
       (1279306279580438529, 'spczdmQDfBAn5', 1236159916641619970, 'UX Engineering', 1, 1, 0, '2020-07-04 14:49:20', '2022-03-01 14:50:44'),
       (1279306845094252545, 'spczdmQDfBAn5', 1236159916641619970, 'BackendEngineering', 1, 2, 0, '2020-07-04 14:51:34', '2022-03-01 14:50:55'),
       (1283285207447699457, 'spczdmQDfBAn5', 1236155491650899970, 'GM', 1, 4, 0, '2020-07-15 14:20:10', '2020-07-15 14:20:39'),
       (1342304314473648129, 'spczdmQDfBAn5', 1236159923558027266, 'Product Community', 1, 1, 0, '2020-12-25 11:01:02', '2022-03-01 14:52:34'),
       (1348518395039653890, 'spczdmQDfBAn5', 1236159923558027266, 'Product Platform', 1, 2, 0, '2021-01-11 14:33:34', '2022-03-01 14:52:25'),
       (1348518430007566337, 'spczdmQDfBAn5', 1236159923558027266, 'Product Design', 1, 3, 0, '2021-01-11 14:33:42', '2022-03-01 14:52:45'),
       (1424627977210224641, 'spczdmQDfBAn5', 1236159916641619970, 'Quality Engineering', 1, 3, 0, '2021-08-09 15:05:52', '2022-03-01 14:51:44'),
       (1481090465825501186, 'spczdmQDfBAn5', 1236159916641619970, 'Mobile Engineering', 1, 4, 0, '2022-01-12 10:27:39', '2022-03-01 14:51:58'),
       (1498207615168450561, 'spczdmQDfBAn5', 1236159916641619970, 'Infra', 1, 5, 0, '2022-02-28 16:05:05', '2022-02-28 16:05:05'),
       (1499491659373031234, 'spczdmQDfBAn5', 1279306845094252545, 'BackendEngineering one', 1, 3, 0, '2022-05-07 14:06:19', '2022-05-07 14:06:24');
