package com.vikadata.api.enterprise.widget.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Widget Information View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Widget Information View")
public class WidgetInfo {

    @ApiModelProperty(value = "Widget ID", example = "wdt123", position = 1)
    private String widgetId;

    @ApiModelProperty(value = "Widget Name", example = "Widget instance name", position = 2)
    private String widgetName;

    @ApiModelProperty(value = "Cover drawing of component package", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageCover;

    @ApiModelProperty(value = "Data source table ID", example = "dst123", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetId;

    @ApiModelProperty(value = "Data source data table name", example = "wpkABC", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetName;

    @ApiModelProperty(value = "Package Icon", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageIcon;
}
