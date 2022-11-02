package com.vikadata.api.model.vo.template;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullArraySerializer;

/**
 * <p>
 * 模板搜索结果
 * </p>
 *
 * @author Chambers
 * @date 2020/11/2
 */
@Data
@ApiModel("模板搜索结果")
public class TemplateSearchResult {

    @ApiModelProperty(value = "模版ID", example = "tplHTbkg7qbNJ", position = 1)
    private String templateId;

    @ApiModelProperty(value = "模板名称", example = "这是一个模板", position = 2)
    private String templateName;

    @ApiModelProperty(value = "模板分类code", example = "tpcCq88sqNqEv", position = 1)
    private String categoryCode;

    @ApiModelProperty(value = "模板分类名称", example = "电视剧", position = 2)
    private String categoryName;

    @ApiModelProperty(value = "标签名称", example = "电视剧", position = 2)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> tags;

}
