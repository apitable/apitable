package com.vikadata.api.template.vo;

import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.cache.bean.Banner;

/**
 * <p>
 * Template Center - Recommend View
 * </p>
 */
@Data
@ApiModel("Recommend View")
public class RecommendVo {

    @ApiModelProperty(value = "Top Banner", position = 1)
    private List<Banner> top;

    @ApiModelProperty(value = "Custom Albums Groups", position = 2)
    private List<AlbumGroupVo> albumGroups;

    @ApiModelProperty(value = "Custom Template Groups", position = 3)
    private List<TemplateGroupVo> templateGroups;

    @Deprecated
    private List<TemplateGroupVo> categories;
}
