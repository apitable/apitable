package com.vikadata.api.model.vo.asset;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * <p>
 * Resource Direct Transfer Token Result View
 * </p>
 */
@Data
@ApiModel("Resource Direct Transfer Token Result View")
public class AssetUploadTokenVo {

    @ApiModelProperty(value = "Upload voucher", position = 1)
    private String uploadToken;

    @ApiModelProperty(value = "Resource name", position = 2)
    private String resourceKey;

    @ApiModelProperty(value = "Upload type (QINIU: Qiniu Cloud)", position = 3)
    private String uploadType;

    @ApiModelProperty(value = "Endpoint", position = 4)
    private String endpoint;

}
