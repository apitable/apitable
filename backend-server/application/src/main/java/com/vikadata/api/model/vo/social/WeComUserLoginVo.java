package com.vikadata.api.model.vo.social;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企业微信应用用户登录返回信息
 * </p>
 * @author Pengap
 * @date 2021/8/19 15:53:12
 */
@Data
@ApiModel("企业微信应用用户登录返回信息")
public class WeComUserLoginVo {

    @ApiModelProperty(value = "应用绑定的空间站ID", position = 1)
    private String bindSpaceId;

}
