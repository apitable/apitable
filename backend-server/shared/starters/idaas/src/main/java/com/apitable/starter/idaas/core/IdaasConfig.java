package com.apitable.starter.idaas.core;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * IDaaS config
 * </p>
 *
 */
@Setter
@Getter
public class IdaasConfig {

    /**
     * Idaas domain name of the management interface. Example：https://demo-admin.cig.tencentcs.com
     */
    private String systemHost;

    /**
     * Idaas domain name of address book interface. Example：https://{tenantName}-admin.cig.tencentcs.com
     */
    private String contactHost;

}
