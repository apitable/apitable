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

CREATE TABLE `${table.prefix}template`
(
    `id`            bigint(20) unsigned NOT NULL COMMENT 'Primary Key',
    `node_id`       varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  DEFAULT NULL COMMENT 'The essence of a template is to map a static node and its data',
    `type`          tinyint(2) unsigned NOT NULL COMMENT 'Template Type(0:PreInstall Official pre installation,1:Space User Space,2:Marketplace release to the market, part of Sku)',
    `type_id`       varchar(255)        NOT NULL COMMENT 'Correspond Type Identification(Official pre installation/Space Code/SKU)',
    `category_name` varchar(255)                                                  DEFAULT NULL COMMENT 'Category Name',
    `name`          varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Template Name',
    `used_times`    int(10) UNSIGNED    NOT NULL                                  DEFAULT 0 COMMENT 'Use Number',
    `is_deleted`    tinyint(1) unsigned NOT NULL                                  DEFAULT '0' COMMENT 'Delete Tag (0: No, 1: Yes)',
    `created_by`    bigint(20)                                                    DEFAULT NULL COMMENT 'Creator',
    `updated_by`    bigint(20)                                                    DEFAULT NULL COMMENT 'Last Update By',
    `created_at`    timestamp           NOT NULL                                  DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    `updated_at`    timestamp           NULL                                      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='Template Center - Template Table';
