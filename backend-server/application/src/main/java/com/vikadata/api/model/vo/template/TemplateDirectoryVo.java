package com.vikadata.api.model.vo.template;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.model.vo.node.NodeShareTree;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Catalog View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Template Catalog View")
public class TemplateDirectoryVo {

    @ApiModelProperty(value = "Template ID", example = "tplHTbkg7qbNJ", position = 1)
    private String templateId;

    @ApiModelProperty(value = "Template classification code", example = "tpcCq88sqNqEv", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryCode;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Template Classification Name", example = "TV play", position = 2)
    private String categoryName;

    @ApiModelProperty(value = "Template Name", example = "This is a template", position = 2)
    private String templateName;

    @ApiModelProperty(value = "Node tree of template mapping", position = 7)
    private NodeShareTree nodeTree;

    @ApiModelProperty(value = "Creator user ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "Creator User UUID", dataType = "java.lang.String", example = "1", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Creator's avatar", example = "public/2020/...", position = 9)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Creator nickname", example = "Zhang San", position = 10)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String nickName;

    @ApiModelProperty(value = "Space name", example = "vika", position = 11)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceName;
}
