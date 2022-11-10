package com.vikadata.api.model.vo.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Create Result View
 * </p>
 */
@Data
@ApiModel("Widget Create Result View")
public class WidgetReleaseCreateVo {

    @ApiModelProperty(value = "Package ID", example = "wpkABC", position = 1)
    private String packageId;

}
