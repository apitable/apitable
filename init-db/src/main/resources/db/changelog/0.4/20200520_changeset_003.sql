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

CREATE TABLE `${table.prefix}content_censor_report`
(
    `id`            bigint(20)                             NOT NULL COMMENT 'Primary Key',
    `user_id`       bigint(20) unsigned                             DEFAULT NULL COMMENT 'Whistleblower user ID(link#xxxx_user#id)',
    `node_id`       varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Node ID',
    `report_reason` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Report Reason',
    `created_at`    timestamp                              NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    `updated_at`    timestamp                              NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='Content Report Record Table';
