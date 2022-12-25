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

INSERT INTO `space` (`id`, `space_id`, `name`, `props`,
                          `is_invite`, `is_forbid`, `allow_apply`,
                          `is_deleted`, `owner`, `creator`)
VALUES (41, 'spc41', '41 Space',
        '{\"joinable\": 1, \"invitable\": 1, \"mobileShowable\": 0, \"nodeExportable\": 0, \"watermarkEnable\": 0}',
        1, 1, 1, 0, 41, 41);