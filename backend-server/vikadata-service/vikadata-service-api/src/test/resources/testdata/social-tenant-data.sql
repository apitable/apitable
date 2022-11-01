INSERT INTO `vika_social_tenant` (`id`, `app_id`, `app_type`, `tenant_id`,
                                  `contact_auth_scope`, `auth_mode`,
                                  `permanent_code`, `auth_info`, `platform`,
                                  `status`)
VALUES (41, 'ai41', 1, 'ww41', NULL, 1, NULL,
        '{"appAuthInfo": {"agentId": "41", "appName": "test" }}',
        2, 1);
INSERT INTO `vika_social_tenant` (`id`, `app_id`, `app_type`, `tenant_id`,
                                  `contact_auth_scope`, `auth_mode`,
                                  `permanent_code`, `auth_info`, `platform`,
                                  `status`)
VALUES (45, 'ai45', 2, 'ww45', NULL, 1, NULL,
        '{"authInfo": {"agent": [{"appid": "ai45", "agentid": "45", "agentName": "test"}]}}',
        2, 1);