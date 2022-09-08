package com.vikadata.api.modular.base.model;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 附件资源上传凭证RO
 * </p>
 *
 * @author Chambers
 * @date 2022/8/3
 */
@Data
@ApiModel("附件资源上传凭证RO")
public class AssetUploadCertificateRO {

    @ApiModelProperty(value = "创建的凭证数量（默认为1，最大为100）", position = 1)
    @Min(value = 1, message = "数量错误")
    @Max(value = 20, message = "数量错误")
    private Integer count = 1;

    @ApiModelProperty(value = "类型(0:用户头像;1:空间logo;2:数表附件;3:封面图;4:节点描述)", example = "0", position = 2, required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;

    @ApiModelProperty(value = "节点Id（数表附件、封面图和节点描述须传）", example = "dst10", position = 3)
    private String nodeId;

    @ApiModelProperty(value = "密码登录人机验证，前端获取getNVCVal函数的值（未登录状态下会进行人机验证）", example = "FutureIsComing", position = 4)
    private String data;

}
