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

package com.apitable.shared.cache.bean;

import static com.apitable.shared.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * <p>
 * user login cache.
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class LoginUserDto implements Serializable {

    private static final long serialVersionUID = -5514888389641162703L;

    /**
     * user id.
     */
    private Long userId;

    /**
     * uuid.
     */
    private String uuid;

    /**
     * nickName.
     */
    private String nickName;

    /**
     * area code.
     */
    private String areaCode;

    /**
     * mobile phone.
     */
    private String mobile;

    /**
     * email.
     */
    private String email;

    /**
     * user avatar.
     */
    private String avatar;

    /**
     * user default avatar color number.
     */
    private Integer color;

    /**
     * user time zone.
     */
    private String timeZone;

    /**
     * need password.
     */
    private Boolean needPwd = false;

    /**
     * sign up time.
     */
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime signUpTime;

    /**
     * last login time.
     */
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime lastLoginTime;

    /**
     * locale.
     */
    private String locale;

    /**
     * is paused.
     */
    private Boolean isPaused = false;

    /**
     * is nicName modified.
     */
    private Boolean isNickNameModified;

    public String getLocale() {
        return locale == null ? null : locale.replace("_", "-");
    }
}
