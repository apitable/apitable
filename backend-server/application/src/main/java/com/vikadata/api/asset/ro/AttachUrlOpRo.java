package com.vikadata.api.asset.ro;

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
