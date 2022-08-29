package com.vikadata.boot.autoconfigure.auth0;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Shawn Deng
 */
@ConfigurationProperties(prefix = "vikadata-starter.auth0")
public class Auth0Properties {

    private boolean enabled = false;

    private String clientId;

    private String clientSecret;

    private String issuerUri;

    private String redirectUri;

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
}
