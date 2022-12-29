package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * Node Search Results
 * </p>
 */
@Data
@ApiModel("Node Search Results")
@EqualsAndHashCode(callSuper = true)
public class NodeSearchResult extends NodeInfoVo {

    @ApiModelProperty(value = "Parent Path", example = "nod11", position = 15)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String superiorPath;
}
