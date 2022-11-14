package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * Get the registration code for registering We Com and installing vika
 * </p>
 */
@ApiModel("Get the registration code for registering We Com and installing vika")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvRegisterInstallWeComVo {

    @ApiModelProperty(value = "Registration code", required = true)
    private String registerCode;

}
