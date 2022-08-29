package com.vikadata.api.model.ro.verification;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

/**
 * 邮箱验证码请求参数
 *
 * @author Chambers
 * @since 2019/10/14
 */
@Data
@ApiModel("邮箱验证码请求参数")
public class EmailOpRo {

    @ApiModelProperty(value = "邮箱", example = "...@vikadata.com", position = 1, required = true)
    @NotBlank(message = "邮箱不能为空")
    @Pattern(regexp = PatternConstants.EMAIL, message = "邮箱格式不正确", flags = Flag.CASE_INSENSITIVE)
    private String email;

    @ApiModelProperty(value = "短信验证码类型", dataType = "java.lang.Integer", example = "1", position = 2, required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;
}
