package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 节点信息视图
 * </p>
 *
 * @author Chambers
 * @date 2021/1/6
 */
@Data
@ApiModel("节点信息视图")
@EqualsAndHashCode(callSuper = true)
public class NodeInfo extends BaseNodeInfo {

    @ApiModelProperty(value = "节点图标", example = ":smile", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String icon;
}
