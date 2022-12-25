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
public class AttachAuditScenesResultRo {

	@ApiModelProperty(value = "The status code 0 is successful, 1 is waiting for processing, 2 is processing, 3 processing failed, and 4 notification submission failed.", position = 3, required = true)
	@NotNull(message = "Processing queue name")
	private String code;

	@ApiModelProperty(value = "Message Results", position = 2, required = true)
	@NotNull(message = "Message Results")
	private String message;

	@ApiModelProperty(value = "The status code 0 is successful, 1 is waiting for processing, 2 is processing, 3 processing failed, and 4 notification submission failed.", position = 3, required = true)
	@NotNull(message = "Processing queue name")
	private AttachAuditScenesRo scenes;

	@ApiModelProperty(value = "Processing queue name", position = 2, required = true)
	@NotNull(message = "Processing queue name")
	private String suggestion;

}
