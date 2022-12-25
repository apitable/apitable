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

INSERT INTO `space_invite_record` (`id`, `invite_member_id`,
                                                   `invite_space_id`, `invite_space_name`,
                                                   `invite_email`, `invite_token`,
                                                   `invite_url`, `send_status`,
                                                   `status_desc`, `is_expired`)
VALUES (41, 41, 'spc41', 'give apitable room to test', '41@apitable.com', 'token', 'url', 1, 'sent successfully', 1);