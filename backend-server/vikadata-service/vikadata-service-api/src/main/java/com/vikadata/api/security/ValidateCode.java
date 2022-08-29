package com.vikadata.api.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 抽象的验证码信息封装类
 * 手机短信和邮箱只是它的下属
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 14:40
 */
public class ValidateCode implements Serializable {

    private static final long serialVersionUID = 1095898624022052744L;

    /**
     * 验证码
     */
    private String code;

    /**
     * 业务作用域，代表此验证码只在某业务下有效，获取登录验证码，只能在登录业务下有效
     * 存储值为{@code CodeValidateScope.name().toLowerCase()}
     *
     * @see CodeValidateScope
     */
    private String scope;

    /**
     * 失效时间
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

    /**
     * 是否已过期
     *
     * @return true | false
     */
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
