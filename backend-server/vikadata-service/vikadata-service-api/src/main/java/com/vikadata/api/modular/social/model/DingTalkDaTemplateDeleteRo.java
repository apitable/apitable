package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 钉钉搭--删除应用(删除应用)
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/28 15:05
 */
@ApiModel("钉钉搭--删除应用(删除应用)")
@Data
public class DingTalkDaTemplateDeleteRo {
    @ApiModelProperty(value = "使用模版的企业ID", required = true, position = 1)
    private String corpId;

    @ApiModelProperty(value = "创建人id", required = true, position = 2)
    private String opUserId;

    @ApiModelProperty(value = "应用实例id", position = 3)
    private String bizAppId;

    @ApiModelProperty(value = "当前时间戳", required = true, position = 4)
    private String timestamp;

    @ApiModelProperty(value = "签名", required = true, position = 5)
    private String signature;

    @ApiModelProperty(value = "请求id，便于排查问题", position = 6)
    private String requestId;
}
