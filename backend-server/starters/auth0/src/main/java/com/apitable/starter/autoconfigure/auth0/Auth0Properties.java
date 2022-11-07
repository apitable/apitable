package com.apitable.starter.autoconfigure.auth0;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.auth0")
public class Auth0Properties {

    /**
     * whether enabled this feature
     */
    private boolean enabled = false;

    /**
     * client id
     */
    private String clientId;

    /**
     *  client secret
     */
    private String clientSecret;

    /**
     * issuer uri
     */
    private String issuerUri;

    /**
     * which Redirect uri after Login
     */
    private String redirectUri;

    /**
     * DB connection Id
     */
    private String dbConnectionId;

    /**
     * DB Connection Name
     */
    private String dbConnectionName;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getIssuerUri() {
        return issuerUri;
    }

    public void setIssuerUri(String issuerUri) {
        this.issuerUri = issuerUri;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public String getDbConnectionId() {
        return dbConnectionId;
    }

    public void setDbConnectionId(String dbConnectionId) {
        this.dbConnectionId = dbConnectionId;
    }

    public String getDbConnectionName() {
        return dbConnectionName;
    }

    public void setDbConnectionName(String dbConnectionName) {
        this.dbConnectionName = dbConnectionName;
    }
}
