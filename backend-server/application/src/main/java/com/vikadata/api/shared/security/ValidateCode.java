package com.vikadata.api.shared.security;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

/**
 * <p>
 * abstract captcha information encapsulation class
 * </p>
 *
 * @author Shawn Deng
 */
public class ValidateCode implements Serializable {

    private static final long serialVersionUID = 1095898624022052744L;

    private String code;

    /**
     * Business scope, which means that this verification code is only valid under a certain business, and obtaining the login verification code is only valid under the login business
     * see {@code CodeValidateScope.name().toLowerCase()}
     *
     * @see CodeValidateScope
     */
    private String scope;

    /**
     * expire time
     */
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime expireTime;

    public ValidateCode() {
    }

    public ValidateCode(String code, int expireIn) {
        this.code = code;
        this.expireTime = LocalDateTime.now().plusSeconds(expireIn);
    }

    public ValidateCode(String code, String scope, int expireIn) {
        this.code = code;
        this.scope = scope;
        this.expireTime = LocalDateTime.now().plusSeconds(expireIn);
    }

    public ValidateCode(String code, String scope, LocalDateTime expireTime) {
        this.code = code;
        this.scope = scope;
        this.expireTime = expireTime;
    }

    @JsonIgnore
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expireTime);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public LocalDateTime getExpireTime() {
        return expireTime;
    }

    public void setExpireTime(LocalDateTime expireTime) {
        this.expireTime = expireTime;
    }
}
