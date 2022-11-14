package com.vikadata.api.player.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Activity Status Parameters
 * </p>
 */
@Data
@ApiModel("Activity Status Parameters")
public class ActivityStatusRo {

    @ApiModelProperty(value = "Boot ID. See the config table of the airtable for specific information", dataType = "java.lang.Integer", example = "1", required = true)
    @NotNull(message = "Boot ID cannot be empty")
    private Integer wizardId;

}
