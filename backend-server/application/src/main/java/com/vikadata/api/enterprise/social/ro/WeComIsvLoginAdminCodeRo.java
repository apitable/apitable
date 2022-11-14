package com.vikadata.api.enterprise.social.ro;

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
 * Authorized login of third-party applications in WeCom
 * </p>
 */
@ApiModel("WeCom application administrator login request parameters")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvLoginAdminCodeRo {

    @ApiModelProperty(value = "Application package  ID", required = true)
    @NotBlank
    private String suiteId;

    @ApiModelProperty(value = "Login authorization code", required = true)
    @NotBlank
    private String authCode;

}
