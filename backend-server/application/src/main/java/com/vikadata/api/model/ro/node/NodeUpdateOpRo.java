package com.vikadata.api.model.ro.node;

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

/**
 * Node Edit Request Parameters
 */
@Data
@ApiModel("Node Edit Request Parameters")
public class NodeUpdateOpRo {

    @ApiModelProperty(value = "Name", example = "This is a new node name", position = 1)
    @Size(max = 100, message = "The name length cannot exceed 100 bits")
    private String nodeName;

    @ApiModelProperty(value = "Icon", example = ":smile", position = 2)
    private String icon;

    @ApiModelProperty(value = "Cover, Empty（'null' OR 'undefined'）", example = "space/2020/5/19/..", position = 3)
    private String cover;

    @ApiModelProperty(value = "Whether to display the recorded history", example = "1", position = 4)
    @Range(min = 0, max = 1, message = "Display record history can only be 0/1")
    private Integer showRecordHistory;
}
