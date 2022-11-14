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
 * Get the authorization link for installing vika
 * </p>
 */
@ApiModel("Get the authorization link for installing vika")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvRegisterInstallSelfUrlVo {

    @ApiModelProperty(value = "Authorization link", required = true)
    private String url;

    @ApiModelProperty(value = "Random status code in authorization link", required = true)
    private String state;

}
