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
public class AttachAuditResultRo {

	@ApiModelProperty(value = "The label to which the picture belongs. A picture can only have one label", position = 1, required = true)
	@NotNull(message = "The label to which the picture belongs. A picture can only have one label")
	private String label;

	@ApiModelProperty(value = "Confidence of the label to which the picture belongs", position = 2, required = true)
	@NotNull(message = "Confidence of the label to which the picture belongs")
	private float score;

}
