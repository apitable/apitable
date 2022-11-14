package com.vikadata.api.template.vo;

import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Template Center - Template Category Content View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Template Category Content View")
public class TemplateCategoryContentVo {

    @ApiModelProperty(value = "Albums View List", position = 1)
    private List<AlbumVo> albums;

    @ApiModelProperty(value = "Template View List", position = 2)
    private List<TemplateVo> templates;
}
