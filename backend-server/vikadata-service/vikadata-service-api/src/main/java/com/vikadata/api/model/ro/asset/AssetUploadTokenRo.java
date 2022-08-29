package com.vikadata.api.model.ro.asset;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * <p>
 * 资源直传Token请求参数
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 17:32:02
 */
@Data
@ApiModel("资源直传Token请求参数")
public class AssetUploadTokenRo {

    @NotNull
    @ApiModelProperty(value = "上传scope（0:单个文件-default；1:多个文件）", position = 1)
    private Integer prefixalScope;

    @ApiModelProperty(value = "上传单个文件时必填", position = 2)
    private String assetsKey;

    @ApiModelProperty(value = "空间站ID", position = 3)
    private String spaceId;

}
