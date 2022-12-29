package com.vikadata.api.base.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * widget upload token
 * @author tao
 */
@Data
@ApiModel("widget upload toke require")
@Builder
public class WidgetUploadTokenVo {


    @ApiModelProperty(value = "resource key", example = "widget/wpkXxx/icon.png")
    private String token;

    @ApiModelProperty(value = "upload url", example = "https://bucket.s3.us-east-1.amazon.com/resourceKey?X-Amz-Algorithm=AWS4-HMAC-SHA256", position = 2)
    private String uploadUrl;

    @ApiModelProperty(value = "upload request method", example = "POST", position = 3)
    private String uploadRequestMethod;

}