package com.vikadata.api.model.vo.template;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullArraySerializer;

/**
 * <p>
 * Template Center - Template Search Result View
 * </p>
 *
 * @author Chambers
 * @date 2022/9/16
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Template Search Result View")
public class TemplateSearchResultVo {

    @ApiModelProperty(value = "Albums View List", position = 1)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<AlbumVo> albums;

    @ApiModelProperty(value = "Template View List", position = 2)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<TemplateSearchResult> templates;

}
