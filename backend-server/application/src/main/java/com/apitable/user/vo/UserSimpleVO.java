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

package com.apitable.user.vo;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * User simple vo.
 * </p>
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User simple vo.")
public class UserSimpleVO {

    /**
     * uuid.
     */
    @Schema(description = "User UUID", example = "1261273764218")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    /**
     * nickName.
     */
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Nickname", example = "Zhang San")
    private String nickName;

    /**
     * user avtar.
     */
    @JsonSerialize(nullsUsing = NullStringSerializer.class,
        using = ImageSerializer.class)
    @Schema(description = "Avatar", example = "null")
    private String avatar;
}
