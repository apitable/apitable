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

package com.apitable.template.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Reference Template Request Parameters
 * </p>
 */
@Data
@ApiModel("Reference Template Request Parameters")
public class QuoteTemplateRo {

    @ApiModelProperty(value = "Template ID", example = "tplHTbkg7qbNJ", position = 1, required = true)
    @NotBlank(message = "Template ID cannot be empty")
    private String templateId;

    @ApiModelProperty(value = "Parent node ID", example = "fodSf4PZBNwut", position = 2, required = true)
    private String parentId;

    @ApiModelProperty(value = "Whether to retain data", example = "true", position = 3)
    private Boolean data = true;
}
