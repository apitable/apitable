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