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

package com.apitable.user.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * User Action Request Parameters.
 */
@Data
@Schema(description = "User Action Request Parameters")
public class UserOpRo {

    /**
     * nickName max size.
     */
    private final int maxSize = 32;

    /**
     * user avatar.
     */
    @Schema(description = "Avatar", example = "https://...")
    private String avatar;

    /**
     * default avatar color number.
     */
    @Schema(description = "default avatar color", example = "1")
    private Integer avatarColor;

    /**
     * user nickName.
     */
    @Schema(description = "Nickname", example = "This is a nickname")
    @Size(max = maxSize, message = "Nickname length cannot exceed 32 bits")
    private String nickName;

    /**
     * is init.
     */
    @Schema(description = "Whether it is a registered initialization nickname", example = "true")
    private Boolean init;

    /**
     * locale.
     */
    @Schema(description = "Language", example = "zh-CN")
    private String locale;

    /**
     * time zone.
     */
    @Schema(description = "Time Zone", example = "America/Toronto")
    private String timeZone;
}
