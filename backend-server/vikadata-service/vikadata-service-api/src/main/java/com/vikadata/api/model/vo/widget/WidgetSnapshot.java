package com.vikadata.api.model.vo.widget;

import java.util.HashMap;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 组件快照信息（对齐前端结构要求）
 * </p>
 *
 * @author Chambers
 * @date 2021/01/11
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("组件快照信息")
@Builder(toBuilder = true)
public class WidgetSnapshot {

    @ApiModelProperty(value = "组件名称", example = "组件实例名称", position = 1)
    private String widgetName;

    @ApiModelProperty(value = "数据源数表ID", example = "dst123", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetId;

    @ApiModelProperty(value = "存储配置", position = 3)
    private HashMap<Object,Object> storage;

    @ApiModelProperty(value = "数据源引用来源ID", example = "mir123", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String sourceId;
}
