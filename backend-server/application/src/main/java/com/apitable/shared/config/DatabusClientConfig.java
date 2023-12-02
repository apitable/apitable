/*
 * APITable Ltd. <legal@apitable.com>
 * Copyright (C)  2022 APITable Ltd. <https://apitable.com>
 *
 * This code file is part of APITable Enterprise Edition.
 *
 * It is subject to the APITable Commercial License and conditional on having a fully paid-up license from APITable.
 *
 * Access to this code file or other code files in this `enterprise` directory and its subdirectories does not constitute permission to use this code or APITable Enterprise Edition features.
 *
 * Unless otherwise noted, all files Copyright © 2022 APITable Ltd.
 *
 * For purchase of APITable Enterprise Edition license, please contact <sales@apitable.com>.
 */

package com.apitable.shared.config;

import com.apitable.databusclient.ApiClient;
import com.apitable.databusclient.api.AutomationDaoApiApi;
import com.apitable.shared.config.properties.DatabusClientProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * DatabusClientConfig.
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(DatabusClientProperties.class)
public class DatabusClientConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(DatabusClientConfig.class);
    private final DatabusClientProperties databusClientProperties;


    public DatabusClientConfig(DatabusClientProperties databusClientProperties) {
        this.databusClientProperties = databusClientProperties;
    }

    /**
     * Common databus client.
     *
     * @return {@link ApiClient}
     */
    @Bean
    public ApiClient apiClient() {
        LOGGER.info("Register Databus Client Bean");
        ApiClient client = new ApiClient();
        client.setBasePath(databusClientProperties.getHost());
        return client;
    }

    /**
     * Common databus automation client.
     *
     * @return {@link AutomationDaoApiApi}
     */
    @Bean
    public AutomationDaoApiApi automationDaoApiApi(ApiClient apiClient) {
        LOGGER.info("Register Databus AutomationDaoApiApi Bean");
        return new AutomationDaoApiApi(apiClient);
    }

}
