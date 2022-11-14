package com.vikadata.api.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.space.model.SpaceGlobalFeature;

/**
 * <p>
 * Space Management - Workbench Set Request Parameters
 * </p>
 *
 * The status field is consistent with the serialized object of the read library
 * @see com.vikadata.api.lang.SpaceGlobalFeature
 */
@Data
@ApiModel("Space Management - Workbench Set Request Parameters")
public class SpaceWorkbenchSettingRo {

    @ApiModelProperty(value = "All members of the node can be exported", example = "true", position = 1)
    private Boolean nodeExportable;

    @ApiModelProperty(value = "Global Watermark On Status", example = "true", position = 1)
    private Boolean watermarkEnable;
}
