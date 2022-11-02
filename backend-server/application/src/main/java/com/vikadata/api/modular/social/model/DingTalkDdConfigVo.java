package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * dd.config params
 * </p>
 */
@ApiModel("dd.config params")
@Data
public class DingTalkDdConfigVo {

    @ApiModelProperty(value = "Application agent Id", position = 1)
    private String agentId;

    @ApiModelProperty(value = "Current enterprise ID", position = 2)
    private String corpId;

    @ApiModelProperty(value = "Time stamp", position = 3)
    private String timeStamp;

    @ApiModelProperty(value = "Custom Fixed String", position = 4)
    private String nonceStr;

    @ApiModelProperty(value = "signature", position = 5)
    private String signature;
}
