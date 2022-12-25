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

CREATE TABLE `${table.prefix}player_notification`
(
    `id`          bigint(20) UNSIGNED NOT NULL COMMENT 'Primary Key',
    `space_id`    varchar(32)                  DEFAULT NULL COMMENT 'Space ID',
    `from_user`   bigint(20)          NOT NULL DEFAULT 0 COMMENT 'Send user,this is system user if 0',
    `to_user`     bigint(20)          NOT NULL COMMENT 'Receive User',
    `node_id`     varchar(32)                  DEFAULT NULL COMMENT 'Node ID(Redundant Field)',
    `template_id` varchar(50)         NOT NULL COMMENT 'Notification Template ID',
    `notify_type` varchar(10)         NOT NULL DEFAULT 0 COMMENT 'Notification Type',
    `notify_body` json                         DEFAULT NULL COMMENT 'Notification Message Body',
    `is_read`     tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Read or not (0: No, 1: Yes)',
    `is_deleted`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Delete Tag (0: No, 1: Yes)',
    `created_at`  timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    `updated_at`  timestamp           NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_user_type` (`to_user`, `notify_type`) USING BTREE
) ENGINE = INNODB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT = 'Notification Center - Notification Record Table';
