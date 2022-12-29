package com.vikadata.api.base.model;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Attachment resource upload certificate RO
 */
@Data
@ApiModel("Attachment resource upload certificate RO")
public class AssetUploadCertificateRO {

    @ApiModelProperty(value = "Number of credentials created default 1 max 100", position = 1)
    @Min(value = 1, message = "min wrong count")
    @Max(value = 20, message = "max wrong count")
    private Integer count = 1;

    @ApiModelProperty(value = "Type (0: user avatar; 1: space logo; 2: number table attachment; 3: cover image; 4: node description)", example = "0", position = 2, required = true)
    @NotNull(message = "Type cannot be null")
    private Integer type;

    @ApiModelProperty(value = "Node Id (data table attachment, cover image and node description must be passed)", example = "dst10", position = 3)
    private String nodeId;

    @ApiModelProperty(value = "Password login man-machine verification, the front end obtains the value of the get NVC Val function (man-machine verification will be performed when not logged in)", example = "FutureIsComing", position = 4)
    private String data;

}
