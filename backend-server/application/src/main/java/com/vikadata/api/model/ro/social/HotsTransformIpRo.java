package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

/**
 * <p>
 * Domain name conversion IP request parameters
 * </p>
 */
@Data
@ApiModel("Domain name conversion IP request parameters")
public class HotsTransformIpRo {

    @NotBlank
    @Pattern(regexp = PatternConstants.DOMAIN, message = "Domain Wrong Format")
    @ApiModelProperty(value = "Domain name", example = "spcxqmlr2lusd.enp.vika.ltd")
    private String domain;

}
