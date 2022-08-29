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
 * 模板目录视图
 * </p>
 *
 * @author Chambers
 * @date 2020/5/23
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("模板目录视图")
public class TemplateDirectoryVo {

    @ApiModelProperty(value = "模版ID", example = "tplHTbkg7qbNJ", position = 1)
    private String templateId;

    @ApiModelProperty(value = "模板分类code", example = "tpcCq88sqNqEv", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryCode;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "模板分类名称", example = "电视剧", position = 2)
    private String categoryName;

    @ApiModelProperty(value = "模板名称", example = "这是一个模板", position = 2)
    private String templateName;

    @ApiModelProperty(value = "模版映射的节点树", position = 7)
    private NodeShareTree nodeTree;

    @ApiModelProperty(value = "创建者用户ID(实际返回是uuid)", dataType = "java.lang.String", example = "1", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "创建者用户UUID", dataType = "java.lang.String", example = "1", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "创建者头像", example = "public/2020/...", position = 9)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "创建者昵称", example = "张三", position = 10)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String nickName;

    @ApiModelProperty(value = "空间站名称", example = "维格智数", position = 11)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceName;
}
