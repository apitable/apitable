package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enums.action.ValidateType;

/**
 * <p>
 * 空间删除请求参数
 * </p>
 *
 * @author Chambers
 * @date 2021/6/16
 */
@Data
@ApiModel("空间删除请求参数")
public class SpaceDeleteRo {

    @ApiModelProperty(value = "校验类型（sms_code/email_code，两者皆无不传）", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "手机/邮件 验证码", example = "123456", position = 2)
    private String code;

}
