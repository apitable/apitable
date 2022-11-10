package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullArraySerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Collection;

/**
 * <p>
 * User's resource information in the specified space
 * </p>
 */
@Data
@ApiModel("User's resource information view in the space")
public class UserSpaceVo {

    @ApiModelProperty(value = "Space name", example = "My Workspace", position = 1)
    private String spaceName;

    @ApiModelProperty(value = "Primary administrator or not", example = "true", position = 2)
    private Boolean mainAdmin;

    @ApiModelProperty(value = "Permission", dataType = "List", example = "[\"MANAGE_TEAM\",\"MANAGE_MAIN_ADMIN\"]", position = 3)
    @JsonSerialize(using = NullArraySerializer.class, nullsUsing = NullArraySerializer.class)
    private Collection<String> permissions;
}
