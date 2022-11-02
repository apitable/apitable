package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 组件信息视图
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("组件信息视图")
public class WidgetInfo {

    @ApiModelProperty(value = "组件ID", example = "wdt123", position = 1)
    private String widgetId;

    @ApiModelProperty(value = "组件名称", example = "组件实例名称", position = 2)
    private String widgetName;

    @ApiModelProperty(value = "组件包封面图", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageCover;

    @ApiModelProperty(value = "数据源数表ID", example = "dst123", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetId;

    @ApiModelProperty(value = "数据源数表名称", example = "wpkABC", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetName;

    @ApiModelProperty(value = "组件包Icon", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageIcon;
}
