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

package com.apitable.starter.databus.autoconfigure;


import static com.apitable.starter.databus.autoconfigure.DatabusClientProperties.PREFIX_CONST;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Databus client properties.
 */
@ConfigurationProperties(prefix = PREFIX_CONST)
public class DatabusClientProperties {

    public static final String PREFIX_CONST = "databus.client";

    private String host;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }
}
