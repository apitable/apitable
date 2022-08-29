package com.vikadata.boot.autoconfigure.idaas;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * 玉符 IDaaS 配置信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 18:59:23
 */
@Configuration
@ConfigurationProperties(prefix = "vikadata-starter.idaas")
public class IdaasProperties {
    private boolean enabled = false;

    /**
     * 是否私有化部署。默认 false
     */
    private boolean selfHosted = false;

    /**
     * 玉符管理接口的域名。如：https://demo-admin.cig.tencentcs.com
     */
    private String manageHost;

    /**
     * 玉符通讯录接口的域名。如：https://{tenantName}-admin.cig.tencentcs.com
     */
    private String contactHost;

    /**
     * 请求维格的域名
     */
    private String serverHost;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isSelfHosted() {
        return selfHosted;
    }

    public void setSelfHosted(boolean selfHosted) {
        this.selfHosted = selfHosted;
    }

    public String getManageHost() {
        return manageHost;
    }

    public void setManageHost(String manageHost) {
        this.manageHost = manageHost;
    }

    public String getContactHost() {
        return contactHost;
    }

    public void setContactHost(String contactHost) {
        this.contactHost = contactHost;
    }

    public String getServerHost() {
        return serverHost;
    }

    public void setServerHost(String serverHost) {
        this.serverHost = serverHost;
    }

}
