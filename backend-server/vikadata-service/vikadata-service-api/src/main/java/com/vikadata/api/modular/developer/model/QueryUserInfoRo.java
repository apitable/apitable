package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * query user contact information request param
 *
 */
@Data
@ApiModel("query user contact information request param")
public class QueryUserInfoRo {

    @ApiModelProperty(value = "host", required = true, example = "https://integration.vika.ltd", position = 1)
    private String host;

    @ApiModelProperty(value = "datasheetId", required = true, example = "dstyLyo90skGTTfPkw", position = 2)
    private String datasheetId;

    @ApiModelProperty(value = "viewId", required = true, example = "viwQBpMksyCqy", position = 3)
    private String viewId;

    @ApiModelProperty(value = "token", required = true, example = "uskxVwqyXWmpzM3jxCXBcGK", position = 4)
    private String token;
}