package com.vikadata.api.internal.model;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 *
 * </p>
 *
 * @author Chambers
 * @date 2021/12/13
 */
@Data
@ApiModel("内部接口-权限请求参数")
public class InternalPermissionRo {

    @ApiModelProperty(value = "节点ID列表", required = true, example = "[\"fomtujwf5eSWKiMaVw\",\"dstbw4CZFURbchgP17\"]", position = 1)
    @NotEmpty(message = "节点ID列表不能为空")
    private List<String> nodeIds;

    @ApiModelProperty(value = "节点分享ID", dataType = "java.lang.String", example = "shr8T8vAfehg3yj3McmDG", position = 2)
    private String shareId;
}
