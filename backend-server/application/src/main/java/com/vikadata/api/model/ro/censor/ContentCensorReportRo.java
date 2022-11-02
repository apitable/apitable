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
* 内容安全-举报信息ro
* </p>
*
* @author Benson Cheung
* @date 2020/03/23
*/
@Data
@ApiModel("内容安全-举报信息ro")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ContentCensorReportRo {

    @NotBlank(message = "被举报的维格表")
    @ApiModelProperty(value = "被举报的维格表", example = "dstjuHFsxyvH6751p1", position = 1)
    private String nodeId;

    @NotBlank(message = "举报原因")
    @ApiModelProperty(value = "举报原因", example = "色情低俗", position = 4)
    private String reportReason;


}
