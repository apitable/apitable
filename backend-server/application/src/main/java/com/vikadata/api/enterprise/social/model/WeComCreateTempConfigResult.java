package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * <p>
 * WeCom Create Temporary Authorization Configuration Result View
 * </p>
 */
@Data
@Accessors(chain = true)
@ApiModel("WeCom Create Temporary Authorization Configuration Result View")
public class WeComCreateTempConfigResult {

    @ApiModelProperty(value = "Profile sha", position = 1)
    private String configSha;

    @ApiModelProperty(value = "WeCom exclusive domain name", example = "spcxqmlr2lusd.enp.vika.ltd", position = 2)
    private String domainName;

}
