package com.vikadata.api.enterprise.widget.vo;

import java.util.HashMap;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Widget snapshot information (alignment with front-end structure requirements)
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Widget snapshot information")
@Builder(toBuilder = true)
public class WidgetSnapshot {

    @ApiModelProperty(value = "Widget Name", example = "Widget instance name", position = 1)
    private String widgetName;

    @ApiModelProperty(value = "Data source table ID", example = "dst123", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetId;

    @ApiModelProperty(value = "Storage configuration", position = 3)
    private HashMap<Object,Object> storage;

    @ApiModelProperty(value = "Data source reference source ID", example = "mir123", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String sourceId;
}
