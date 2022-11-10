package com.vikadata.api.model.vo.social;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * WeCom Profile Verification Result View
 * </p>
 */
@Data
@ApiModel("WeCom Profile Verification Result View")
public class WeComCheckConfigVo {

    @ApiModelProperty(value = "Whether the configuration file passes the verification", position = 1)
    private Boolean isPass;

    @ApiModelProperty(value = "Shas generated after configuration file verification", position = 2)
    private String configSha;

    @ApiModelProperty(value = "WeCom exclusive domain name", example = "spcxqmlr2lusd.enp.vika.ltd", position = 3)
    private String domainName;

}
