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

import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Image review result request parameters")
public class AttachAuditCallbackRo {

	@ApiModelProperty(value = "Persistent ID of processing task", position = 1, required = true)
	@NotNull
	private String id;

	@ApiModelProperty(value = "Processing queue name", position = 2, required = true)
	@NotNull
	private String pipeline;

	@ApiModelProperty(value = "Status code 0 succeeded, 1 waiting for processing, 2 processing, 3 processing failed, 4 notification submission failed", position = 3, required = true)
	@NotNull
	private Integer code;

	@ApiModelProperty(value = "Detailed description corresponding to the status code", position = 4, required = true)
	@NotNull
	private String desc;

	@ApiModelProperty(value = "The request ID of the cloud processing request is mainly used for troubleshooting by Qiniu technicians", position = 5, required = true)
	@NotNull
	private String reqid;

	@ApiModelProperty(value = "The name of the space where the source file is processed", position = 6, required = true)
	@NotNull
	private String inputBucket;

	@ApiModelProperty(value = "File name of processing source file", position = 7, required = true)
	@NotNull
	private String inputKey;

	@ApiModelProperty(value = "Callback results after file processing", position = 8, required = true)
	@NotNull
	private List<AttachAuditItemsRo> items;
}
