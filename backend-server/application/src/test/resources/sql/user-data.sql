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

INSERT INTO user(id, uuid, nick_name, email, `code`, mobile_phone)
VALUES (1, '23a5f52cd1ee4e6abdc8a77e9b73cdeb', 'Shawn', 'jack@apitable.com', '+86',
        '13631619061'),
       (2, '3e2f7d835958472ab43a623f15dec64f', 'Chambers', 'joe@apitable.com',
        '+86',
        '13425442832'),
       (3, '23a5f52cd1ee4e6abdc8a77e9b73cdec', 'Benson', 'kelvin@apitable.com', '+86',
        '13265435122');

INSERT INTO `user` (`id`, `uuid`, `nick_name`, `code`, `mobile_phone`, `email`,
                         `locale`, `is_paused`, `avatar`)
VALUES (41, '41', '41', '+86', '41', '41@apitable.com', 'zh-CN', 0, 'public/2020/12/23/e4dbe06647fe4acba4ca941898cba38d');
INSERT INTO `user` (`id`, `uuid`, `nick_name`, `code`, `mobile_phone`, `email`,
                         `locale`, `is_paused`, `avatar`)
VALUES (45, '45', '45', '+86', '45', '45@apitable.com', 'zh-CN', 1, 'public/2020/12/23/e4dbe06647fe4acba4ca941898cba38d');