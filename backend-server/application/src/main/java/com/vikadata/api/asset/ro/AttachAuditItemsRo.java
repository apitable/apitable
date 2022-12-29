package com.vikadata.api.asset.ro;

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
