package com.vikadata.api.model.vo.template;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 模版视图
 * </p>
 *
 * @author Chambers
 * @date 2020/5/22
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("模版视图")
public class TemplateVo {

    @ApiModelProperty(value = "模版ID", example = "tplHTbkg7qbNJ", position = 1)
    private String templateId;

    @ApiModelProperty(value = "模板名称", example = "这是一个模板", position = 2)
    private String templateName;

    @ApiModelProperty(value = "模版映射的节点Id", example = "nod10", position = 3)
    private String nodeId;

    @ApiModelProperty(value = "节点类型", example = "1", position = 4)
    private Integer nodeType;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "封面图", example = "http://...", position = 5)
    private String cover;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "描述", example = "这是一个showcase", position = 6)
    private String description;

    @ApiModelProperty(value = "创建者用户ID(实际返回是uuid)", dataType = "java.lang.String", example = "1", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "创建者用户UUID", dataType = "java.lang.String", example = "1", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "创建者头像", example = "public/2020/...", position = 7)
    private String avatar;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "创建者昵称", example = "张三", position = 8)
    private String nickName;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 9)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "模版标签", example = "[\"aaa\", \"bbb\"]", position = 10)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> tags;

}
