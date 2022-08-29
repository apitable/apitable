package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

/**
 * <p>
 * 域名转换IP请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/8/3 18:14:11
 */
@Data
@ApiModel("域名转换IP请求参数")
public class HotsTransformIpRo {

    @NotBlank
    @Pattern(regexp = PatternConstants.DOMAIN, message = "Domain Wrong Format")
    @ApiModelProperty(value = "域名", example = "spcxqmlr2lusd.enp.vika.ltd")
    private String domain;

}
