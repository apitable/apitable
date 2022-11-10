package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Get the widget store list parameter
 * </p>
 */
@Data
@ApiModel("Widget Store List Please Parameter")
public class WidgetStoreListRo {

    @ApiModelProperty(value = "Whether to filter unpublished widget (true: filter, false: not filter)", example = "false", position = 1)
    private Boolean filter;

    @NotNull
    @ApiModelProperty(value = "Get widget type (0: space station, 1: global, 10: to be approved)", example = "1", position = 2)
    private Integer type;

    @ApiModelProperty(value = "Specify the return language", example = "zh-CN", position = 3, hidden = true)
    private String language;

    @ApiModelProperty(value = "Global widget search keywords to be audited", position = 4)
    private String previewSearchKeyword;

}
