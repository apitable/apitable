package com.vikadata.api.model.ro.developer;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enums.action.ValidateType;

/**
 * <p>
 * 刷新开发者访问令牌请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 17:41
 */
@Data
@ApiModel("刷新开发者访问令牌请求参数")
public class RefreshApiKeyRo {

    @ApiModelProperty(value = "校验类型（sms_code/email_code，两者皆无不传）", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "验证码", example = "125484", position = 1)
    private String code;
}
