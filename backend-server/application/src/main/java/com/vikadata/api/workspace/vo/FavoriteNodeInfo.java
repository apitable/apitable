package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * Favorite node information
 * </p>
 */
@Data
@ApiModel("Favorite node information")
@EqualsAndHashCode(callSuper = true)
public class FavoriteNodeInfo extends NodeInfoVo {

    @ApiModelProperty(value = "The predecessor node ID of the favorite node", example = "nod11", position = 15)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String preFavoriteNodeId;
}
