-- APITable Ltd. <legal@apitable.com>
-- Copyright (C)  2022 APITable Ltd. <https://apitable.com>
--
-- This code file is part of APITable Enterprise Edition.
--
-- It is subject to the APITable Commercial License and conditional on having a fully paid-up license from APITable.
--
-- Access to this code file or other code files in this `enterprise` directory and its subdirectories does not constitute permission to use this code or APITable Enterprise Edition features.
--
-- Unless otherwise noted, all files Copyright © 2022 APITable Ltd.
--
-- For purchase of APITable Enterprise Edition license, please contact <sales@apitable.com>.

INSERT INTO `widget_package_release` (`id`, `release_sha`, `version`, `package_id`,
                                           `release_user_id`, `release_code_bundle`,
                                           `source_code_bundle`, `secret_key`,
                                           `status`, `release_note`, `is_deleted`,
                                           `created_by`, `updated_by`, `install_env_code`, `runtime_env_code`)
VALUES (41, '41', '1.0.0', 'wpk41', 5, '', NULL, NULL, 0, NULL, 0, 41, 41, 01, 01);