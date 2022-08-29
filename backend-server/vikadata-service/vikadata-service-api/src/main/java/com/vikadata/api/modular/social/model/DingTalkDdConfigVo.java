package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * dd.config params
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/30 15:25
 */
@ApiModel("钉钉--dd.config需要的参数")
@Data
public class DingTalkDdConfigVo {

    @ApiModelProperty(value = "应用agengId", position = 1)
    private String agentId;

    @ApiModelProperty(value = "当前企业ID", position = 2)
    private String corpId;

    @ApiModelProperty(value = "时间戳", position = 3)
    private String timeStamp;

    @ApiModelProperty(value = "自定义固定字符串", position = 4)
    private String nonceStr;

    @ApiModelProperty(value = "签名", position = 5)
    private String signature;
}
