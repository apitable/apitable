package com.vikadata.api.shared.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.shared.config.properties.OneAccessProperties.PREFIX;


@ConfigurationProperties(prefix = PREFIX)
public class OneAccessProperties {
    public static final String PREFIX = "vikadata.oneaccess";

    /**
     * OneAccess function switch
     */
    private Boolean enabled =  Boolean.FALSE;
    /**
     * Iam server Host
     */
    private String iamHost;

    /**
     * Client application registration ID (provided by IAM)
     */
    private String clientId;

    /**
     * Client application registration secret (provided by IAM)
     */
    private String clientSecret;

    /**
     *  encryption authentication key
     */
    private String encryptKey;

    /**
     * Encryption algorithm, only supports AES
     */
    private String encryptAlg;

    /**
     * Collaboration spaceId
     */
    private String collaborationSpaceId;

    /**
     * Government WeCom configuration
     */
    private WeCom weCom;

    public Boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getIamHost() {
        return iamHost;
    }

    public void setIamHost(String iamHost) {
        this.iamHost = iamHost;
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

    public String getEncryptKey() {
        return encryptKey;
    }

    public void setEncryptKey(String encryptKey) {
        this.encryptKey = encryptKey;
    }

    public String getEncryptAlg() {
        return encryptAlg;
    }

    public void setEncryptAlg(String encryptAlg) {
        this.encryptAlg = encryptAlg;
    }


    public String getCollaborationSpaceId() {
        return collaborationSpaceId;
    }

    public void setCollaborationSpaceId(String collaborationSpaceId) {
        this.collaborationSpaceId = collaborationSpaceId;
    }


    public WeCom getWeCom() {
        return weCom;
    }

    public void setWeCom(WeCom weCom) {
        this.weCom = weCom;
    }

    public static class WeCom {
        private String corpid;

        private String secret;

        private String baseApiUrl;

        private Integer agentId;

        public String getCorpid() {
            return corpid;
        }

        public void setCorpid(String corpid) {
            this.corpid = corpid;
        }

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public String getBaseApiUrl() {
            return baseApiUrl;
        }

        public void setBaseApiUrl(String baseApiUrl) {
            this.baseApiUrl = baseApiUrl;
        }

        public Integer getAgentId() {
            return agentId;
        }

        public void setAgentId(Integer agentId) {
            this.agentId = agentId;
        }
    }

}
