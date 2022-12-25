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

INSERT INTO `unit_member` (`id`, `user_id`, `space_id`, `member_name`, `job_number`,
                                `position`, `mobile`, `email`, `open_id`, `status`,
                                `name_modified`, `is_social_name_modified`, `is_point`,
                                `is_active`, `is_admin`)
VALUES (1, 4, 'spcYVmyayXYbq', 'my name is dong dong', '143613308', 'manager 12', '13265435122',
        'joe@apitable.com', NULL, 0, 1, 2, 0, 1, 1),
       (2, 5, 'spcYVmyayXYbq', 'Chambers', '001', 'ED', '13425442832',
        'jack@apitable.com', NULL, 1, 1, 2, 0, 1, 1);