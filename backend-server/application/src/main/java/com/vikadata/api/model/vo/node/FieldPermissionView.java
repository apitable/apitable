package com.vikadata.api.model.vo.node;

import java.util.Map;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Field Permission View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Field Permission View")
public class FieldPermissionView {

    @ApiModelProperty(value = "Node ID", example = "dstGxznHFXf9pvF1LZ")
    private String nodeId;

    @ApiModelProperty(value = "Datasheet ID（Node ID / Source Datasheet node ID）", example = "dstGxznHFXf9pvF1LZ", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "Datasheet field permission information", dataType = "java.util.Map", position = 2)
    private Map<String, FieldPermissionInfo> fieldPermissionMap;
}
