package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 节点搜索结果
 * </p>
 *
 * @author Chambers
 * @date 2020/9/4
 */
@Data
@ApiModel("节点搜索结果")
@EqualsAndHashCode(callSuper = true)
public class NodeSearchResult extends NodeInfoVo {

    @ApiModelProperty(value = "上级路径", example = "nod11", position = 15)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String superiorPath;
}
