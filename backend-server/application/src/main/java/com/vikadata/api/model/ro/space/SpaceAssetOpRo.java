package com.vikadata.api.model.ro.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * 空间附件资源请求参数
 *
 * @author Chambers
 * @since 2020/3/31
 */
@Data
@ApiModel("空间附件资源请求参数")
public class SpaceAssetOpRo {

    @ApiModelProperty(value = "写入token集合", position = 1)
    private List<OpAssetRo> addToken = new ArrayList<>();

    @ApiModelProperty(value = "删除token集合", position = 2)
    private List<OpAssetRo> removeToken = new ArrayList<>();

    @ApiModelProperty(value = "数表节点Id", example = "dst10", position = 3, required = true)
    @NotBlank(message = "数表ID不能为空")
    private String nodeId;

    @Getter
    @Setter
    @ApiModel("附件资源请求参数")
    public static class OpAssetRo {

        @ApiModelProperty(value = "附件token", position = 1, required = true)
        @NotNull(message = "token不能为空")
        private String token;

        @ApiModelProperty(value = "附件名称", position = 2, required = true)
        @NotNull(message = "附件名称不能为空")
        private String name;
    }

}
