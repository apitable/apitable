package com.vikadata.api.model.vo.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Store List Extended Information View
 * </p>
 */
@Data
@ApiModel("Widget Store List Extended Information View")
public class WidgetStoreListExtraInfo {

    @ApiModelProperty(value = "Widget official website address", position = 1)
    private String website;

}
