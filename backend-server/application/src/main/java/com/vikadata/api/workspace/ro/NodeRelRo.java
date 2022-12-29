package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Node Association Request Parameters
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Node Association Request Parameters")
public class NodeRelRo {

    @ApiModelProperty(value = "Datasheet ID", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "View ID", position = 2)
    private String viewId;

    public NodeRelRo(String viewId) {
        this.viewId = viewId;
    }
}
