package com.vikadata.api.enterprise.social.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
@ApiModel("WeCom application user login request parameters")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvLoginCodeRo {

    @ApiModelProperty(value = "Application suit ID", required = true)
    @NotBlank
    private String suiteId;

    @ApiModelProperty(value = "Login authorization code", required = true)
    @NotBlank
    private String code;

}
