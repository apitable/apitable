ALTER TABLE vika_unit_member ADD COLUMN `open_id` varchar(255) NULL DEFAULT NULL COMMENT '第三方平台用户标识' AFTER `email`;
