package com.vikadata.api.model.vo.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 节点转存结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 14:16
 */
@Data
@ApiModel("节点转存结果视图")
public class StoreNodeInfoVO {

    @ApiModelProperty(value = "新节点ID", example = "nod2818jsak", position = 1)
    private String nodeId;
}
