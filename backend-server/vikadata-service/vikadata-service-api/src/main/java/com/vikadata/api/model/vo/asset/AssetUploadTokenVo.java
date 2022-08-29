package com.vikadata.api.model.vo.asset;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * <p>
 * 资源直传Token结果视图
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 17:32:02
 */
@Data
@ApiModel("资源直传Token结果视图")
public class AssetUploadTokenVo {

    @ApiModelProperty(value = "上传凭证", position = 1)
    private String uploadToken;

    @ApiModelProperty(value = "资源名", position = 2)
    private String resourceKey;

    @ApiModelProperty(value = "上传类型（QINIU:七牛云）", position = 3)
    private String uploadType;

    @ApiModelProperty(value = "端点", position = 4)
    private String endpoint;

}
