package com.vikadata.api.template.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Recommend Custom Template Group View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Recommend Custom Template Group View")
public class TemplateGroupVo {

    @ApiModelProperty(value = "Template Group Name", example = "Other Users Also Like", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String name;

    @ApiModelProperty(value = "Template View List", position = 2)
    private List<TemplateVo> templates;

    @Deprecated
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryName;

    @Deprecated
    private List<TemplateVo> templateVos;

    public TemplateGroupVo(String name, List<TemplateVo> templates) {
        this.name = name;
        this.templates = templates;
        this.categoryName = name;
        this.templateVos = templates;
    }
}
