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

CREATE TABLE `${table.prefix}resource_changeset`
(
    `id`          bigint(20) unsigned NOT NULL COMMENT 'Primary Key',
    `resource_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  DEFAULT NULL COMMENT 'Resource ID(node_id/widget_id/..)',
    `message_id`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'The unique ID of the changeset request, which is used to ensure the uniqueness of the changeset',
    `operations`  longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Collection of operation actions',
    `revision`    bigint(20) unsigned                                           DEFAULT '0' COMMENT 'Version',
    `source_type` tinyint(2) unsigned                                           DEFAULT '0' COMMENT 'Data source type (0: default)',
    `created_by`  bigint(20)                                                    DEFAULT NULL COMMENT 'Create User',
    `created_at`  timestamp           NOT NULL                                  DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `uk_rsc_msg_id` (`resource_id`, `message_id`) USING BTREE,
    UNIQUE KEY `uk_rsc_rvs` (`resource_id`, `revision`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='Workbench - Resource Changeset Table';
