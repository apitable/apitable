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

package com.apitable.widget.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * widget release request.
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "widget release request")
public class WidgetPackageReleaseV2Ro extends WidgetPackageBaseV2Ro {

    @Schema(description = "space id", example = "spcyQkKp9XJEl")
    @NotBlank(message = "Space id not blank")
    private String spaceId;

    @Schema(description = "widget name", example = "{'zh-CN':'Chinese','en-US':'English'}")
    private String name;

    @Schema(description = "release note")
    private String releaseNote;

    @Schema(description = "is sandbox")
    private Boolean sandbox;

    @Schema(description = "install environment", example = "dashboard")
    private List<String> installEnv;

    @Schema(description = "runtime environment", example = "mobile")
    private List<String> runtimeEnv;

}