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

CREATE TABLE `${table.prefix}datasheet_record_comment`
(
    `id`          bigint(20) unsigned                                          NOT NULL COMMENT 'Primary Key',
    `dst_id`      varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Datasheet ID',
    `record_id`   varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Record ID',
    `comment_id`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'chengeset generated comment_id',
    `comment_msg` json                                                         NOT NULL COMMENT 'Comment rich text content',
    `revision`    bigint(20) unsigned                                                   DEFAULT '0' COMMENT 'Record version number',
    `is_deleted`  tinyint(1) unsigned                                                   DEFAULT '0' COMMENT 'Delete tag (0: No, 1: Yes)',
    `member_id`   bigint(20)                                                            DEFAULT NULL COMMENT '[Redundancy]Action member ID(link#xxxx_unit_member#id)',
    `created_by`  bigint(20)                                                            DEFAULT NULL COMMENT 'Creator',
    `updated_by`  bigint(20)                                                            DEFAULT NULL COMMENT 'Last Update By',
    `created_at`  timestamp                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    `updated_at`  timestamp                                                    NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    PRIMARY KEY (`id`) USING BTREE,
    KEY `idx_dst_id` (`dst_id`) USING BTREE,
    KEY `idx_record_id` (`record_id`) USING BTREE,
    KEY `idx_comment_id` (`comment_id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='Workbench - Datasheet Record Comment Table';
