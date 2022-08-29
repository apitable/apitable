package com.vikadata.integration.idaas;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 玉符 IDaaS 配置
 * </p>
 * @author 刘斌华
 * @date 2022-05-12 15:21:10
 */
@Setter
@Getter
public class IdaasConfig {

    /**
     * 玉符管理接口的域名。如：https://demo-admin.cig.tencentcs.com
     */
    private String systemHost;

    /**
     * 玉符通讯录接口的域名。如：https://{tenantName}-admin.cig.tencentcs.com
     */
    private String contactHost;

}
