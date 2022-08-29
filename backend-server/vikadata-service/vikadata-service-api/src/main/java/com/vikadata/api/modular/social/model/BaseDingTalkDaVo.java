package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Setter;

/**
 * <p> 
 * 钉钉搭回调基本信息返回
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/28 15:05
 */
@ApiModel("钉钉搭回调基本信息返回")
@Data
@Setter
public class BaseDingTalkDaVo {
    @ApiModelProperty(value = "是否成功")
    private Boolean success;

    @ApiModelProperty(value = "错误码,success为false时必须返回")
    private Integer errCode;

    @ApiModelProperty(value = "错误信息,success为false时必须返回")
    private String errMsg;

    @ApiModelProperty(value = "错误信息,success为false时必须返回")
    private Object result;
}
