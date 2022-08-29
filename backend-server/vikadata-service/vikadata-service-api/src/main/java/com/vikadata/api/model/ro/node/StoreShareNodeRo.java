package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 转存分享节点请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/26 13:19
 */
@Data
@ApiModel("转存分享节点请求参数")
public class StoreShareNodeRo {

    @NotBlank(message = "空间ID不能为空")
    @ApiModelProperty(value = "空间ID", example = "spc20cjiwis2", position = 1)
    private String spaceId;

    @NotBlank(message = "分享ID不能为空")
    @ApiModelProperty(value = "分享ID", example = "shrSJ921CNsj", position = 2)
    private String shareId;
}
