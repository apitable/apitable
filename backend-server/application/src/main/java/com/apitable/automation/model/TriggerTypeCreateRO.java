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
 * TriggerTypeCreateRO.
 */
@Data
@Schema(description = "TriggerTypeCreateRO")
public class TriggerTypeCreateRO {

    @Schema(description = "service id")
    @NotBlank
    private String serviceId;

    @Schema(description = "trigger type id")
    private String triggerTypeId;

    @Schema(description = "name")
    @NotBlank
    private String name;

    @Schema(description = "description")
    private String description;

    @Schema(description = "input JSON format")
    private String inputJsonSchema;

    @Schema(description = "output JSON format")
    private String outputJsonSchema;

    @Schema(description = "trigger prototype endpoint")
    @NotBlank
    private String endpoint;

    @Schema(description = "i18n package")
    private String i18n;

}
