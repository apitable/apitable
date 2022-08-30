package com.vikadata.api.modular.base.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 附件资源上传凭证结果VO
 * </p>
 *
 * @author Chambers
 * @date 2022/8/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("附件资源上传凭证结果VO")
public class AssetUploadCertificateVO {

    @ApiModelProperty(value = "资源名，文件访问相对路径（可能非最终的值）", example = "spc10/2019/12/10/159.jpg", position = 1)
    private String token;

    @ApiModelProperty(value = "上传请求URL", example = "https://bucket.s3.us-east-1.amazon.com/resourceKey?X-Amz-Algorithm=AWS4-HMAC-SHA256", position = 3)
    private String uploadUrl;

    @ApiModelProperty(value = "上传请求方式", example = "POST", position = 4)
    private String uploadRequestMethod;
}
