package com.vikadata.api.model.ro.asset;

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
public class AttachAuditResultDisableRo {

	@ApiModelProperty(value = "Indicates whether the file is disabled. True indicates that the file is disabled, and false indicates that the file is not disabled. (You need to enable the [Auto Disable] function in the incremental audit configuration)", position = 1, required = true)
	@NotNull(message = "Identification of whether the file is disabled")
	private boolean disable;

	private AttachAuditScenesResultRo result;

}
