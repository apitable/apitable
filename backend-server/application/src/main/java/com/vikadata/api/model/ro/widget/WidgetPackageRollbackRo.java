package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget rollback request parameters
 * </p>
 */
@Data
@ApiModel("Widget rollback request parameters")
public class WidgetPackageRollbackRo {

    @ApiModelProperty(value = "Widget Package ID", example = "wpkAAA", position = 1)
    @NotBlank(message = "Package Id cannot be empty")
    private String packageId;

    @ApiModelProperty(value = "Version No", example = "1.0.0", position = 2)
    @NotBlank(message = "Rollback version number cannot be empty")
    private String version;

}
