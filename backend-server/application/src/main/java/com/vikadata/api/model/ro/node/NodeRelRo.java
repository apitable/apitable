package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 节点关联请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/11/10
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("节点关联请求参数")
public class NodeRelRo {

    @ApiModelProperty(value = "数表ID", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "视图ID", position = 2)
    private String viewId;

    public NodeRelRo(String viewId) {
        this.viewId = viewId;
    }
}
