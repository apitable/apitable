package com.vikadata.api.enterprise.widget.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Package Login Authorization Request Parameters
 * </p>
 */
@Data
@ApiModel("Widget Package Login Authorization Request Parameters")
public class WidgetPackageAuthRo {

    @ApiModelProperty(value = "Package ID", example = "wpkBBB", position = 1)
    private String packageId;

}
