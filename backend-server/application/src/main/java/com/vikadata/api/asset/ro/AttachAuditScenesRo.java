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
public class AttachAuditScenesRo {

	@ApiModelProperty(value = "Audit results of image sensitive persons", position = 1, required = true)
	@NotNull(message = "Yellow identification results of pictures")
	private String politician;

	@ApiModelProperty(value = "Photo Yellow Identification Review Results", position = 2, required = true)
	@NotNull(message = "Yellow identification results of pictures")
	private AttachAuditPulpResultRo pulp;


	@ApiModelProperty(value = "Audit Results of Photo Violence", position = 3, required = true)
	@NotNull(message = "Audit Results of Photo Violence")
	private String terror;
}
