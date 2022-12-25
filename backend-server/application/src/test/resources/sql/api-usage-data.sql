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

INSERT INTO `api_usage` (`id`, `user_id`, `space_id`, `dst_id`,
                                         `req_path`, `req_method`, `api_version`,
                                         `req_ip`, `req_detail`, `res_detail`)
VALUES (41, 41, 'spc41', 'dst41', 'path', 1, 'v1', '127.0.0.1', '{}', '{}');