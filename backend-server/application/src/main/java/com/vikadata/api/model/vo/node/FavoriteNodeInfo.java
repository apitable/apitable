package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 收藏节点信息
 * </p>
 *
 * @author Chambers
 * @date 2020/9/2
 */
@Data
@ApiModel("收藏节点信息")
@EqualsAndHashCode(callSuper = true)
public class FavoriteNodeInfo extends NodeInfoVo {

    @ApiModelProperty(value = "收藏节点的前置节点ID", example = "nod11", position = 15)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String preFavoriteNodeId;
}
