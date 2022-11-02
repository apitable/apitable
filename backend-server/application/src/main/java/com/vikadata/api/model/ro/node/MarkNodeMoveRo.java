package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * 星标节点移动请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/8/15
 */
@Data
@ApiModel("星标节点移动请求参数")
public class MarkNodeMoveRo {

    @ApiModelProperty(value = "节点Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "节点Id不能为空")
    private String nodeId;

    @ApiModelProperty(value = "目标位置的前一个节点，为空时即移动到了首位", example = "nod10", position = 2)
    private String preNodeId;
}
