--
INSERT INTO `vika_app_instance` (`id`, `app_id`, `space_id`, `app_instance_id`,
                                 `app_key`, `app_secret`, `type`, `config`,
                                 `created_by`,
                                 `updated_by`)
VALUES (1498542559780147202, 'app-80c8b19b1d8c4e40a1f4a9854b71ceb0', 'spc2',
        'ai-948e4945130348f09c1f92f57d0bf655', NULL, NULL, 'OFFICE_PREVIEW', '{}',
        4, 4),
       (1506470089447694337, 'app-ea1d17fd8a1449b3ac1a073077d385a5', 'spc2',
        'ai-9d02328d04ef456c9097cfa2883b7cde', 'cli_a13c40d6a278d00c',
        'JCtPdEQSZb3gv3yMXWbFqe6afXxL7fXg', 'LARK', '{
           \"type\": \"LARK\",
           \"profile\": {
               \"appKey\": \"cli_a13c40d6a278d00c\",
               \"appSecret\": \"JCtPdEQSZb3gv3yMXWbFqe6afXxL7fXg\",
               \"eventCheck\": true,
               \"contactSyncDone\": true,
               \"eventEncryptKey\": \"H3BQ8W4xxcv8tJEUM2ct\",
               \"isConfigComplete\": true,
               \"eventVerificationToken\": \"fi7dugAwcJlaXKl76IciSdKvDriUy2MF\"
           }
       }', 4, 4),
       (1503670498274234370, 'app-6f8553ef46df404c8b119d9aba2b0f8a', 'spc3',
        'ai-221f3562cc1b4fbbb71024af1464494a', NULL, NULL, 'LARK_STORE', '{}', 4, 4),
       (1502198856761217025, 'app-184dac9a68624f6c82f8a038a7d960ba', 'spc4',
        'ai-7f3e0a1f60d94271816ab136ab21ce7a', NULL, NULL, 'WECOM', '{}', 4, 4),
       (1506859228954808322, 'app-3677481d600648b59356146e9d0831fc', 'spc5',
        'ai-56238c88c2034cb6b785c6f3f2c7f473', NULL, NULL, 'WECOM_STORE', '{}', 4, 4),
       (1502470906669473793, 'app-4b6245db2667421b91d6d6c33cfb48fa', 'spc6',
        'ai-67c8ce4ef7cd4827acf6dfe4736833e6', NULL, NULL, 'DINGTALK_STORE', '{}', 4, 4),
       (1502475358011756546, 'app-76ec5b03df3346ffb1a643ba888ea9c3', 'spc7',
        'ai-1480581df56847e78338ff8b4f956be4', NULL, NULL, 'DINGTALK', '{}', 4, 4);