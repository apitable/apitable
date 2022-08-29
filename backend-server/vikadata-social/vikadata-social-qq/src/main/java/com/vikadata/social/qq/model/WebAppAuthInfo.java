package com.vikadata.social.qq.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * <p>
 * QQ互联-网站应用 授权信息
 * </p>
 *
 * @author Chambers
 * @date 2020/10/16
 */
public class WebAppAuthInfo {

    @JsonProperty("client_id")
    private String clientId;

    @JsonProperty("openid")
    private String openId;

    @JsonProperty("unionid")
    private String unionId;

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getUnionId() {
        return unionId;
    }

    public void setUnionId(String unionId) {
        this.unionId = unionId;
    }
}
