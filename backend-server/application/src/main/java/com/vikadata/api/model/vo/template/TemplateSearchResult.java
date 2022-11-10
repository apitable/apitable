package com.vikadata.api.model.vo.template;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullArraySerializer;

/**
 * <p>
 * Template Search Results
 * </p>
 */
@Data
@ApiModel("Template Search Results")
public class TemplateSearchResult {

    @ApiModelProperty(value = "Template ID", example = "tplHTbkg7qbNJ", position = 1)
    private String templateId;

    @ApiModelProperty(value = "Template Name", example = "This is a template", position = 2)
    private String templateName;

    @ApiModelProperty(value = "Template classification code", example = "tpcCq88sqNqEv", position = 1)
    private String categoryCode;

    @ApiModelProperty(value = "Template Classification Name", example = "TV play", position = 2)
    private String categoryName;

    @ApiModelProperty(value = "Label Name", example = "TV play", position = 2)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> tags;

}
