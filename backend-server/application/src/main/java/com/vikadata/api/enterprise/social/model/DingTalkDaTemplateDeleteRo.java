package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * DigTalk--Delete app (Delete app)
 * </p>
 */
@ApiModel("DigTalk--Delete app (Delete app)")
@Data
public class DingTalkDaTemplateDeleteRo {
    @ApiModelProperty(value = "Enterprise ID using template", required = true, position = 1)
    private String corpId;

    @ApiModelProperty(value = "Creator ID", required = true, position = 2)
    private String opUserId;

    @ApiModelProperty(value = "Application instance ID", position = 3)
    private String bizAppId;

    @ApiModelProperty(value = "Current timestamp", required = true, position = 4)
    private String timestamp;

    @ApiModelProperty(value = "signature", required = true, position = 5)
    private String signature;

    @ApiModelProperty(value = "Request ID for easy troubleshooting", position = 6)
    private String requestId;
}
