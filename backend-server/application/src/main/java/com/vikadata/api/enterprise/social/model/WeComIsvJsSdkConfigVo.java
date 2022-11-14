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
 * JS-SDK Verify the configuration parameters of enterprise identity and authority
 * </p>
 */
@ApiModel("JS-SDK Verify the configuration parameters of enterprise identity and authority")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvJsSdkConfigVo {

    @ApiModelProperty(value = "The corpId of the currently logged in WeCom", required = true)
    private String authCorpId;

    @ApiModelProperty(value = "Time stamp of signature generation", required = true)
    private Long timestamp;

    @ApiModelProperty(value = "Generate a random string of signatures", required = true)
    private String random;

    @ApiModelProperty(value = "Generated Signature", required = true)
    private String signature;

}
