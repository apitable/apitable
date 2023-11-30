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

INSERT INTO `node` (`id`, `space_id`, `parent_id`, `pre_node_id`, `node_id`,
                    `node_name`, `icon`, `type`, `is_template`, `creator`, `is_deleted`, `is_rubbish`,
                    `is_banned`, `created_by`, `updated_by`)
VALUES (82, 'spczJrh2i3tLW', '0', NULL, 'fodLBWwj51A77', NULL, '5', 0, 0, 0, 0, 0, 0, 5, 5),
       (83, 'spczJrh2i3tLW', 'fodAKWy9gm05x', 'fodttK5L2ALPk', 'fodBa5JGDQZbQ', 'A2', '5', 1, 0, 0, 0, 0, 0, 5, 5),
       (85, 'spczJrh2i3tLW', 'fodAKWy9gm05x', 'fodBa5JGDQZbQ', 'fod78aMjHHRAK', 'A3', '5', 1, 0, 0, 0, 0, 0, 5, 5),
       (86, 'spczJrh2i3tLW', 'fodAKWy9gm05x', NULL, 'fodttK5L2ALPk', 'A1', '5', 1, 0, 0, 0, 0, 0, 5, 5),
       (420, 'spcBrtP3ulTXR', '0', NULL, 'dstb1FgRa6KVzli7cm', NULL, NULL, 0, 0, 2, 0, 0, 0, 1, 1),
       (41, 'spc41', '0', NULL, 'ni41', 'apitable boy', NULL, 0, 0, 2, 0, 0, 0, 41, 41),
       (45, 'spc41', '0', NULL, 'ni45', NULL, NULL, 0, 1, 41, 0, 0, 0, 41, 41);