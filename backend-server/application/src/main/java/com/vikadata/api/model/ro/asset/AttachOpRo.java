package com.vikadata.api.model.ro.asset;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * Attachment Request Parameters
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Attachment Request Parameters")
public class AttachOpRo {

	@ApiModelProperty(value = "Upload files", position = 1, required = true)
	@NotNull(message = "File cannot be empty")
	private MultipartFile file;

	@ApiModelProperty(value = "Type (0: user profile; 1: space logo; 2: data table attachment; 3: cover map; 4: node description)", example = "0", position = 2, required = true)
	@NotNull(message = "Type cannot be empty")
	private Integer type;

	@ApiModelProperty(value = "Node Id (data table attachment, cover map and node description must be transferred)", example = "dst10", position = 4)
	private String nodeId;

    @ApiModelProperty(value = "Password login for human-machine verification, and the front end obtains the value of get NVC Val function (human-machine verification will be performed when not logged in)", example = "FutureIsComing", position = 4)
    private String data;
}
