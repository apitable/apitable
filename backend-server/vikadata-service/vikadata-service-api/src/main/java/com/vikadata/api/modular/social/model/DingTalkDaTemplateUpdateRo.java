package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 钉钉搭--修改应用(修改模板)
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/28 15:05
 */
@ApiModel("钉钉搭--修改应用(修改模板)")
@Data
public class DingTalkDaTemplateUpdateRo {
    @ApiModelProperty(value = "使用模版的企业ID", required = true, position = 1)
    private String corpId;

    @ApiModelProperty(value = "创建人id", required = true, position = 2)
    private String opUserId;

    @ApiModelProperty(value = "应用实例id", position = 3)
    private String bizAppId;

    @ApiModelProperty(value = "应用名称", position = 4)
    private String name;

    @ApiModelProperty(value = "应用状态，0:停用，1:启用", position = 5)
    private Integer appStatus;

    @ApiModelProperty(value = "当前时间戳", required = true, position = 6)
    private String timestamp;

    @ApiModelProperty(value = "签名", required = true, position = 7)
    private String signature;

    @ApiModelProperty(value = "请求id，便于排查问题", position = 8)
    private String requestId;
}
