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

CREATE TABLE `${table.prefix}developer_applet`
(
    `id`            bigint(20) unsigned                                          NOT NULL COMMENT 'Primary Key',
    `space_id`      varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Associated Workshop Space Id',
    `applet_id`     varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Similar to app IDs of other open platforms, globally unique',
    `applet_secret` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The secret key is generally semi hidden and can be reset',
    `is_deleted`    tinyint(1) unsigned                                          NOT NULL DEFAULT '0' COMMENT 'Delete Tag (0: No, 1: Yes)',
    `created_by`    bigint(20)                                                            DEFAULT NULL COMMENT 'Creator',
    `updated_by`    bigint(20)                                                            DEFAULT NULL COMMENT 'Last Update By',
    `created_at`    timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    `updated_at`    timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_applet_id` (`applet_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='Open Platform -  Cloud Program Table';
