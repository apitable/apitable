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

package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;
import lombok.Data;

/**
 * AutomationServiceCreateRO.
 */
@Data
@Schema(description = "Automation Service Create RO")
public class AutomationServiceCreateRO {

    @Schema(description = "service id")
    private String serviceId;

    @Schema(description = "service slug")
    @NotBlank
    private String slug;

    @Schema(description = "name")
    @NotBlank
    private String name;

    @Schema(description = "description")
    private String description;

    @Schema(description = "input JSON format")
    private String logo;

    @Schema(description = "output JSON format")
    private String baseUrl;

    @Schema(description = "i18n package")
    private String i18n;

}
