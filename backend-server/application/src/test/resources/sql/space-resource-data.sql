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

INSERT INTO `space_resource` (`id`, `group_code`, `resource_code`,
                                              `resource_name`, `resource_url`,
                                              `resource_desc`, `assignable`, `is_enabled`)
VALUES (41, 'MANAGE_SPACE', 'MANAGE_WORKBENCH', 'manage configuration', NULL,
        'A role with this resource that can operate on the "Allow Invite Members" configuration', 1, 1);