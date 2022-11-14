package com.vikadata.api.asset.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Token request parameters for direct resource transfer")
public class AssetUploadTokenRo {

    @Deprecated
    @ApiModelProperty(value = "upload prefix scope（0:single-default；1: multi）", position = 1)
    private Integer prefixalScope;

    @ApiModelProperty(value = "required when uploading a single file", position = 2)
    private String assetsKey;

    @ApiModelProperty(value = "space id", position = 3)
    private String spaceId;

}
