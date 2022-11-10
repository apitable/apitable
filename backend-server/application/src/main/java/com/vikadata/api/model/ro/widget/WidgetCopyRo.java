package com.vikadata.api.model.ro.widget;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Copy Request Parameters
 * </p>
 */
@Data
@ApiModel("Widget Copy Request Parameters")
public class WidgetCopyRo {

    @ApiModelProperty(value = "Dashboard ID", required = true, example = "dsb11", position = 1)
    @NotBlank(message = "Dashboard ID cannot be empty")
    private String dashboardId;

    @ApiModelProperty(value = "Widget ID List", required = true, example = "[\"wdtiJjVmNFcFmNtQFA\", \"wdtSbp8TkH7gTGAYR1\"]", position = 2)
    @NotEmpty(message = "Widget ID list cannot be empty")
    private List<String> widgetIds;
}
