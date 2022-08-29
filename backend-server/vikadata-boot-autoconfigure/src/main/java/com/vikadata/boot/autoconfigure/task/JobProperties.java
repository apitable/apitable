package com.vikadata.boot.autoconfigure.task;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 任务配置
 * </p>
 *
 * @author Chambers
 * @date 2019/11/20
 */
@ConfigurationProperties(prefix = "vikadata-starter.job")
public class JobProperties {

    private String registerAddress;

    private String appName;

    private String address;

    private String ip;

    private Integer port;

    private String accessToken;

    private String logPath;

    private Integer logRetentionDays;

    public String getRegisterAddress() {
        return registerAddress;
    }

    public void setRegisterAddress(String registerAddress) {
        this.registerAddress = registerAddress;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getLogPath() {
        return logPath;
    }

    public void setLogPath(String logPath) {
        this.logPath = logPath;
    }

    public Integer getLogRetentionDays() {
        return logRetentionDays;
    }

    public void setLogRetentionDays(Integer logRetentionDays) {
        this.logRetentionDays = logRetentionDays;
    }
}
