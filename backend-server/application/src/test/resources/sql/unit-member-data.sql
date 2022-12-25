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

INSERT INTO `unit_member` (`id`, `space_id`, `member_name`, `email`,
                                `open_id`, `status`,
                                `name_modified`, `is_social_name_modified`, `is_point`,
                                `is_active`, `is_admin`, `is_deleted`)
VALUES (24, 'spc24', '24',
        '24@apitable.com', 'oi24', 0, 1, 2, 0, 0, 1, 0);

INSERT INTO `unit_member` (`id`, `user_id`, `space_id`, `member_name`, `mobile`, `email`,
                                `open_id`, `status`,
                                `name_modified`, `is_social_name_modified`, `is_point`,
                                `is_active`, `is_admin`, `is_deleted`)
VALUES (41, 41, 'spc41', '41', '12345678910',
        '41@apitable.com', '41', 1, 1, 2, 0, 1, 1, 0);

INSERT INTO `unit_member` (`id`, `user_id`, `space_id`, `member_name`, `mobile`, `email`,
                                `open_id`, `status`,
                                `name_modified`, `is_social_name_modified`, `is_point`,
                                `is_active`, `is_admin`, `is_deleted`)
VALUES (45, 45, 'spc45', '45', '12345678910',
        '45@apitable.com', 'oi45', 0, 1, 2, 0, 1, 0, 0);