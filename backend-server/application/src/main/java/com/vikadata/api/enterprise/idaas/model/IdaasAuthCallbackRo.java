package com.vikadata.api.enterprise.idaas.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * The user completes subsequent operations after logging in to the I Daa S system
 * </p>
 */
@ApiModel("The user completes subsequent operations after logging in to the I Daa S system")
@Setter
@Getter
@ToString
@EqualsAndHashCode
@Validated
public class IdaasAuthCallbackRo {

    @ApiModelProperty("Code returned by IDaaS login callback")
    @NotBlank
    private String code;

    @ApiModelProperty("The state returned by the IDaaS login callback")
    @NotBlank
    private String state;

}
