package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Node Share Setting Parameter View
 * </p>
 */
@Data
@ApiModel("Node Share Setting Parameter View")
public class NodeShareSettingPropsVO {

    @ApiModelProperty(value = "Can only view", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean onlyRead;

    @ApiModelProperty(value = "Allow edit", example = "true", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canBeEdited;

    @ApiModelProperty(value = "Allow to be transferred", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canBeStored;
}
