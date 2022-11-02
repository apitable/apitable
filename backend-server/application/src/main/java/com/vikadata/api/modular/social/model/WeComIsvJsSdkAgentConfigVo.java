package com.vikadata.api.modular.social.model;

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
 * JS-SDK Verify the configuration parameters of application identity and permission
 * </p>
 */
@ApiModel("JS-SDK Verify the configuration parameters of application identity and permission")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvJsSdkAgentConfigVo {

    @ApiModelProperty(value = "The corpId of the currently logged in WeCom", required = true)
    private String authCorpId;

    @ApiModelProperty(value = "The application ID of the currently logged in WeCom", required = true)
    private String agentId;

    @ApiModelProperty(value = "Time stamp of signature generation", required = true)
    private Long timestamp;

    @ApiModelProperty(value = "Generate a random string of signatures", required = true)
    private String random;

    @ApiModelProperty(value = "Generated Signature", required = true)
    private String signature;

}
