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
public class AttachAuditPulpResultRo {

	@ApiModelProperty(value = "Suggestion is the corresponding control suggestion of various audit types, Values include:[“block”,”review”,”pass”]", position = 1, required = true)
	@NotNull(message = "Suggestion is the corresponding control suggestion of various audit types, Values include:[“block”,”review”,”pass”]")
	private String suggestion;

	private AttachAuditResultRo result;

}
