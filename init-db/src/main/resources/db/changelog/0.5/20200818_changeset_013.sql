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

CREATE TABLE `${table.prefix}api_usage`
(
    `id`          bigint(20) unsigned                                          NOT NULL COMMENT 'Primary Key',
    `user_id`     bigint(20) unsigned                                          NOT NULL COMMENT 'User ID',
    `dst_id`      varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci          DEFAULT NULL COMMENT 'Datasheet ID(link#xxxx_datasheet#dst_id)',
    `req_path`    varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'API path, data behind the domain name, excluding query data',
    `req_method`  tinyint(2) unsigned                                          NOT NULL DEFAULT '1' COMMENT 'API request mode 1 get 2 post 3 patch 4 put',
    `api_version` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Api version',
    `req_ip`      varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Client IP',
    `req_detail`  json                                                         NOT NULL COMMENT 'api call details, including ua, refer, etc',
    `res_detail`  json                                                         NOT NULL COMMENT 'API call returns information, including code, message, etc',
    `created_at`  timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_user_id` (`user_id`),
    KEY `idx_dst_id` (`dst_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='Open Platform - Api Usage Table';
