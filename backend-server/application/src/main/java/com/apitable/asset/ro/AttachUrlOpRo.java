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

package com.apitable.asset.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

/**
 * <p>
 * Attachment URL Request Parameters
 * </p>
 */
@Data
@ApiModel("Attachment Request Parameters")
public class AttachUrlOpRo {

	@ApiModelProperty(value = "URL of uploaded file", position = 1, required = true)
	@NotNull(message = "File URL cannot be empty")
	private String url;

	@ApiModelProperty(value = "Type (0: user profile 1: space logo 2: data table attachment)", example = "0", position = 2, required = true)
	@NotNull(message = "Type cannot be empty")
	@Max(value = 2, message = "ERROR IN TYPE")
	private Integer type;

	@ApiModelProperty(value = "Data meter node Id (data meter attachment must be transferred)", example = "dst10", position = 4)
	private String nodeId;
}
