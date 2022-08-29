package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 钉钉搭--创建应用(使用模板)
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/28 15:05
 */
@ApiModel("钉钉搭--创建应用(使用模板)")
@Data
public class DingTalkDaTemplateCreateRo {
    @ApiModelProperty(value = "使用模版的企业ID", required = true, position = 1)
    private String corpId;

    @ApiModelProperty(value = "应用名称", required = true, position = 2)
    private String name;

    @ApiModelProperty(value = "创建人id", required = true, position = 3)
    private String opUserId;

    @ApiModelProperty(value = "应用模板key", required = true, position = 4)
    private String templateKey;

    @ApiModelProperty(value = "是否保留样例数据", required = true, position = 5)
    private Boolean keepSampleData;

    @ApiModelProperty(value = "当前时间戳", required = true, position = 6)
    private String timestamp;

    @ApiModelProperty(value = "签名", required = true, position = 7)
    private String signature;

    @ApiModelProperty(value = "请求id，便于排查问题", required = true, position = 8)
    private String requestId;
}
