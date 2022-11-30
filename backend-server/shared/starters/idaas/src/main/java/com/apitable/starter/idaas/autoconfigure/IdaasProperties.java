package com.apitable.starter.idaas.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.idaas")
public class IdaasProperties {
    private boolean enabled = false;

    /**
     * Whether to privatize the deployment. Default false
     */
    private boolean selfHosted = false;

    /**
     * Domain name of Yufu management interface, example：https://demo-admin.cig.tencentcs.com
     */
    private String manageHost;

    /**
     * Domain name of Yufu address book interface, example：https://{tenantName}-admin.cig.tencentcs.com
     */
    private String contactHost;

    /**
     * the host
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
