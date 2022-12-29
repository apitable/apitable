ALTER TABLE `${table.prefix}datasheet_record`
    ADD COLUMN `field_updated_info` json DEFAULT NULL COMMENT '创建用户' AFTER `revision`,
    ADD COLUMN `created_by` bigint(20) DEFAULT NULL COMMENT '创建用户' AFTER `is_deleted`,
    ADD COLUMN `updated_by` bigint(20) DEFAULT NULL COMMENT '最后一次更新用户' AFTER `created_by`;
