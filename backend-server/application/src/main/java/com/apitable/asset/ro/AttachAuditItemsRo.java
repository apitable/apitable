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

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Image audit result request parameters
 * </p>
 */
@Data
@ApiModel("Image audit result request parameters")
public class AttachAuditItemsRo {


	@ApiModelProperty(value = "Operation instructions for processing file results", position = 1, required = true)
	@NotNull(message = "Operation instructions for processing file results")
	private String cmd;

	@ApiModelProperty(value = "Operation status code of processing file results", position = 2, required = true)
	@NotNull(message = "Operation status code of processing file results")
	private String code;

	@ApiModelProperty(value = "Operation description of processing file results", position = 2, required = true)
	@NotNull(message = "Operation description of processing file results")
	private String desc;

	@ApiModelProperty(value = "Results of processing files", position = 3, required = true)
	@NotNull(message = "Results of processing files")
	private AttachAuditResultDisableRo result;


}
