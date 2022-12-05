package com.vikadata.api.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Space management - common members set request parameters
 * </p>
 *
 * The status field is consistent with the serialized object of the read library
 * @see com.vikadata.api.lang.SpaceGlobalFeature
 */
@Data
@ApiModel("Space management - common members set request parameters")
public class SpaceMemberSettingRo {

    @ApiModelProperty(value = "Invitable status of all staff", example = "true", position = 1)
    private Boolean invitable;

    @ApiModelProperty(value = "Allow others to apply for space status", example = "false", position = 2)
    private Boolean joinable;

    @ApiModelProperty(value = "Display member's mobile number", example = "false", position = 3)
    private Boolean mobileShowable;

}
