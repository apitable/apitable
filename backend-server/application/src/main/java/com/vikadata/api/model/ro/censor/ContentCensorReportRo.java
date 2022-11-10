package com.vikadata.api.model.ro.censor;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
* <p>
* Content security - report information ro
* </p>
*/
@Data
@ApiModel("Content security - report information ro")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ContentCensorReportRo {

    @NotBlank(message = "Reported vika")
    @ApiModelProperty(value = "Reported vika", example = "dstjuHFsxyvH6751p1", position = 1)
    private String nodeId;

    @NotBlank(message = "Reasons for reporting")
    @ApiModelProperty(value = "Reasons for reporting", example = "Pornographic and vulgar", position = 4)
    private String reportReason;


}
