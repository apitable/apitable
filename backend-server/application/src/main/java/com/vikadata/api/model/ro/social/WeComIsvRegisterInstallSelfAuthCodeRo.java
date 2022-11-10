package com.vikadata.api.model.ro.social;

import javax.validation.constraints.NotBlank;

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
 * Complete the application installation through the authorization link of the installation vika
 * </p>
 */
@ApiModel("Complete the application installation through the authorization link of the installation vika")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvRegisterInstallSelfAuthCodeRo {

    @ApiModelProperty(value = "Temporary authorization code", required = true)
    @NotBlank
    private String authCode;

    @ApiModelProperty(value = "Random status code", required = true)
    @NotBlank
    private String state;

}
