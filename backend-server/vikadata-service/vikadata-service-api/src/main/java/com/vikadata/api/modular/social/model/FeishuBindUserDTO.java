package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 飞书绑定用户请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-01 11:39:46
 */
@Data
@ApiModel("飞书绑定用户请求参数")
public class FeishuBindUserDTO {

    @ApiModelProperty(value = "区号", example = "+86")
    @NotBlank(message = "手机号所属地区不能为空")
    private String areaCode;

    @ApiModelProperty(value = "手机号码", example = "13800000000")
    @NotBlank(message = "手机号码不能为空")
    private String mobile;

    @ApiModelProperty(value = "手机验证码", example = "123456")
    @NotBlank(message = "手机验证码不能为空")
    private String code;

    @ApiModelProperty(value = "飞书用户在应用的唯一标识", example = "ou_6364101b36f45b594e8aa55edafe52de")
    @NotBlank(message = "企业用户标识不能为空")
    private String openId;

    @ApiModelProperty(value = "飞书用户在应用的唯一标识", example = "ou_6364101b36f45b594e8aa55edafe52de")
    @NotBlank(message = "企业标识不能为空")
    private String tenantKey;
}
