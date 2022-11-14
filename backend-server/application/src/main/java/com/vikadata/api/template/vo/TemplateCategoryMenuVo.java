package com.vikadata.api.template.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Template Category Menu View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Template Category Menu View")
public class TemplateCategoryMenuVo {

    @ApiModelProperty(value = "Template classification code", example = "tpcCq88sqNqEv", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryCode;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Template Classification Name", example = "TV play", position = 2)
    private String categoryName;
}
