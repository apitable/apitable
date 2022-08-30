package com.vikadata.api.modular.base.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 资源上传完成通知RO
 * </p>
 *
 * @author Chambers
 * @date 2022/8/8
 */
@Data
@ApiModel("资源上传完成通知RO")
public class AssetUploadNotifyRO {

    @ApiModelProperty(value = "类型(0:用户头像;1:空间logo;2:数表附件;3:封面图;4:节点描述)", example = "0", position = 1, required = true)
    @NotNull(message = "类型不能为空")
    private Integer type;

    @ApiModelProperty(value = "资源名列表", example = "[\"spc10/2019/12/10/159\", \"spc10/2019/12/10/168\"]", position = 2)
    private List<String> resourceKeys;

}
