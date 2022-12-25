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

CREATE TABLE `${table.prefix}labs_applicant`
(
   `id`             bigint(20) unsigned NOT NULL                                                       COMMENT 'Primary Key',
   `applicant_type` tinyint(2) unsigned NOT NULL                                                       COMMENT 'Applicant Type(0:user_feature, 1:space_feature)',
   `applicant`      varchar(100)        NOT NULL                                                       COMMENT 'Applicant Id, which can be space Id or user Id',
   `feature_key`    varchar(255)        NOT NULL                                                       COMMENT 'Feature Key',
   `is_deleted`     tinyint(1) unsigned NOT NULL                                                       COMMENT 'Delete Tag(0: No, 1: Yes)',
   `created_at`     timestamp           NOT NULL DEFAULT CURRENT_TIMESTAMP                             COMMENT 'Create Time',
   `updated_at`     timestamp           NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
   PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci COMMENT = 'Labs Applicant Table';