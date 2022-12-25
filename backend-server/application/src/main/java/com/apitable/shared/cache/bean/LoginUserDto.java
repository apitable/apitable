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

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Data;

import static com.apitable.shared.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * user login cache
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class LoginUserDto implements Serializable {

    private static final long serialVersionUID = -5514888389641162703L;

    private Long userId;

    private String uuid;

    private String nickName;

    private String areaCode;

    private String mobile;

    private String email;

    private String avatar;

    private Integer color;

    private Boolean needPwd = false;

    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime signUpTime;

    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime lastLoginTime;

    private String locale;

    private Boolean isPaused = false;

    private Boolean isNickNameModified;
}
