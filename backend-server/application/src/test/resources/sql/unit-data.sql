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

-- unit type: member, associated unit-member: 41
INSERT INTO `unit` (`id`, `unit_id`, `space_id`, `unit_type`, `unit_ref_id`, `is_deleted`)
VALUES (41, '1-1', 'spc41', 3, 41, 0);
INSERT INTO `unit` (`id`, `unit_id`, `space_id`, `unit_type`, `unit_ref_id`, `is_deleted`, `created_at`)
VALUES (11, '1-2', 'spcYVmyayXYbq', 1, 1, 0, '2020-01-14 18:23:25');
INSERT INTO `unit` (`id`, `unit_id`, `space_id`, `unit_type`, `unit_ref_id`, `is_deleted`, `created_at`)
VALUES (22, '1-3', 'spcYVmyayXYbq', 3, 2, 0, '2020-01-14 18:23:25');
INSERT INTO `unit` (`id`, `unit_id`, `space_id`, `unit_type`, `unit_ref_id`, `is_deleted`)
VALUES (20220824, '2-1', 'spc20220824', 4, 20220824, 0),
       (2022082401, '2-2', 'spc20220824', 1, 2022082401, 0),
       (2022082402, '2-3', 'spc20220824', 3, 2022082402, 0);