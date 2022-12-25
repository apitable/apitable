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

CREATE TABLE `${table.prefix}code`
(
    `id`              bigint(20) unsigned                                          NOT NULL COMMENT 'Primary Key',
    `type`            tinyint(2) unsigned                                          NOT NULL COMMENT 'Type (0: official invitation code; 1: personal invitation code; 2: exchange code)',
    `activity_id`     bigint(20)                                                            DEFAULT NULL COMMENT 'Activity ID(link#xxxx_code_activity#id)',
    `ref_id`          bigint(20)                                                            DEFAULT NULL COMMENT 'Association ID(Third party member ID/User ID/Redemption template ID)',
    `code`            varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'V Code',
    `available_times` int(10)                                                               DEFAULT NULL COMMENT 'Total Available',
    `remain_times`    int(10)                                                               DEFAULT NULL COMMENT 'Remain Times',
    `limit_times`     int(10)                                                               DEFAULT NULL COMMENT 'Limit the number of uses per person',
    `expired_at`      timestamp                                                    NULL     DEFAULT NULL COMMENT 'Expired Time',
    `assign_user_id`  bigint(20)                                                            DEFAULT NULL COMMENT 'Assign User ID',
    `is_deleted`      tinyint(1) unsigned                                          NOT NULL DEFAULT '0' COMMENT 'Delete Tag (0: No, 1: Yes)',
    `created_by`      bigint(20)                                                            DEFAULT NULL COMMENT 'Creator',
    `updated_by`      bigint(20)                                                            DEFAULT NULL COMMENT 'Last Update By',
    `created_at`      timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    `updated_at`      timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_code` (`code`) USING BTREE COMMENT 'V Code Unique Code'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='V Code System - V Code Table';
