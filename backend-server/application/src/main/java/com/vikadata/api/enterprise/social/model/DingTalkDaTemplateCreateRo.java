package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * DingTalk--Create an app (using a template)
 * </p>
 */
@ApiModel("DingTalk--Create an app (using a template)")
@Data
public class DingTalkDaTemplateCreateRo {
    @ApiModelProperty(value = "Enterprise ID using template", required = true, position = 1)
    private String corpId;

    @ApiModelProperty(value = "APPLY NAME", required = true, position = 2)
    private String name;

    @ApiModelProperty(value = "Creator ID", required = true, position = 3)
    private String opUserId;

    @ApiModelProperty(value = "Application template key", required = true, position = 4)
    private String templateKey;

    @ApiModelProperty(value = "Whether to keep sample data", required = true, position = 5)
    private Boolean keepSampleData;

    @ApiModelProperty(value = "Current timestamp", required = true, position = 6)
    private String timestamp;

    @ApiModelProperty(value = "signature", required = true, position = 7)
    private String signature;

    @ApiModelProperty(value = "Request ID for easy troubleshooting", required = true, position = 8)
    private String requestId;
}
