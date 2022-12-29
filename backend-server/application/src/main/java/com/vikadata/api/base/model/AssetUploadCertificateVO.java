package com.vikadata.api.base.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Attachment resource upload voucher result VO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Attachment resource upload voucher result VO")
public class AssetUploadCertificateVO {

    @ApiModelProperty(value = "File Access Path(possibly non-final value)", example = "spc10/2019/12/10/159.jpg", position = 1)
    private String token;

    @ApiModelProperty(value = "Upload request URL", example = "https://bucket.s3.us-east-1.amazon.com/resourceKey?X-Amz-Algorithm=AWS4-HMAC-SHA256", position = 3)
    private String uploadUrl;

    @ApiModelProperty(value = "Upload request method", example = "POST", position = 4)
    private String uploadRequestMethod;
}
