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

package com.apitable.space.vo;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * Third party integrated information of space.
 */
@Data
@Schema(description = "Third party integrated binding information of the space")
public class SpaceSocialConfig {

    @Schema(description = "Whether the third party platform binding is enabled for the space",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enabled;

    @Schema(description = "Third party platform type（1: WeCom, 2: DingTalk, 3: Lark）",
        example = "1")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer platform;

    @Schema(description = "App ID", example = "1")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private String appId;

    @Schema(description = "Application Type(1: Enterprise self built application, 2: Independent "
        + "service provider)", example = "1")
    private Integer appType;

    @Schema(description = "Authorization mode. 1: Enterprise authorization; 2: Member "
        + "Authorization", example = "1")
    private Integer authMode;

    @Schema(description = "Whether the address book is being synchronized", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean contactSyncing;
}
