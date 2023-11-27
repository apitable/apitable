/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.captcha;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * abstract captcha information encapsulation class.
 * </p>
 *
 * @author Shawn Deng
 */
public class ValidateCode implements Serializable {

    private static final long serialVersionUID = 1095898624022052744L;

    private String code;

    /**
     * Business scope, which means that this verification code is only valid under a certain business, and obtaining the login verification code is only valid under the login business
     * see {@code CodeValidateScope.name().toLowerCase()}.
     *
     * @see CodeValidateScope
     */
    private String scope;

    /**
     * expire time.
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

    /**
     * constructor.
     *
     * @param code     verification code
     * @param scope    business scope
     * @param expireIn expire time
     */
    public ValidateCode(String code, String scope, int expireIn) {
        this.code = code;
        this.scope = scope;
        this.expireTime = LocalDateTime.now().plusSeconds(expireIn);
    }

    /**
     * constructor.
     *
     * @param code       verification code
     * @param expireTime expire time
     */
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
