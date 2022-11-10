package com.vikadata.api.model.ro.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Audit - Pending Review List Request Parameters
 * </p>
 */
@Data
@ApiModel("Widget Audit - Pending Review List Request Parameters")
public class WidgetAuditWaitReviewListRo {

    @ApiModelProperty(value = "Audit widget name", position = 1)
    private String searchKeyword;

    @ApiModelProperty(value = "Specify the return language", example = "zh-CN", position = 3, hidden = true)
    private String language;

}
