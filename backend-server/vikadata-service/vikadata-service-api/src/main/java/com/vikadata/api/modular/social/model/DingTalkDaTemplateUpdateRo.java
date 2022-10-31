package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * DingTalk--Modify Application (Modify Template)
 * </p>
 */
@ApiModel("DingTalk--Modify Application (Modify Template)")
@Data
public class DingTalkDaTemplateUpdateRo {
    @ApiModelProperty(value = "Enterprise ID using template", required = true, position = 1)
    private String corpId;

    @ApiModelProperty(value = "Creator ID", required = true, position = 2)
    private String opUserId;

    @ApiModelProperty(value = "Application instance ID", position = 3)
    private String bizAppId;

    @ApiModelProperty(value = "Apply name", position = 4)
    private String name;

    @ApiModelProperty(value = "Application status, 0: Deactivate, 1: Enable", position = 5)
    private Integer appStatus;

    @ApiModelProperty(value = "Current timestamp", required = true, position = 6)
    private String timestamp;

    @ApiModelProperty(value = "signature", required = true, position = 7)
    private String signature;

    @ApiModelProperty(value = "Request ID for easy troubleshooting", position = 8)
    private String requestId;
}
