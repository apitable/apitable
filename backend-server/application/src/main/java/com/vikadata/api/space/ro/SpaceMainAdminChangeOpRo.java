package com.vikadata.api.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Request parameters of space replacement master administrator
 * </p>
 */
@Data
@ApiModel("Request parameters of space replacement master administrator")
public class SpaceMainAdminChangeOpRo {

    @ApiModelProperty(value = "Member ID of the new master administrator", example = "123456", position = 2, required = true)
    @NotNull(message = "The member ID of the new master administrator cannot be empty")
    private Long memberId;
}
