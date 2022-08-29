package com.vikadata.api.model.vo.node;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullObjectSerializer;

/**
 * <p>
 * 节点分享设置信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 14:00
 */
@Data
@ApiModel("节点分享设置信息视图")
public class NodeShareSettingInfoVO {

    @ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "节点名称", example = "这是一个节点", position = 2)
    private String nodeName;

    @ApiModelProperty(value = "节点图标", example = "smile", position = 3)
    private String nodeIcon;

    @ApiModelProperty(value = "是否开启分享", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean shareOpened;

    @ApiModelProperty(value = "节点分享设置选项", position = 5)
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private NodeShareSettingPropsVO props;

    @ApiModelProperty(value = "分享唯一编码", example = "shrKsX1map5RfYO", position = 6)
    private String shareId;

    @ApiModelProperty(value = "关联表", position = 7)
    @JsonSerialize(nullsUsing = NullArraySerializer.class, using = NullArraySerializer.class)
    private List<String> linkNodes;

    @ApiModelProperty(value = "节点（包括子后代）是否包含成员字段", example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean containMemberFld;

    @ApiModelProperty(value = "开启分享者", example = "张三", position = 9)
    private String shareOpenOperator;

    @ApiModelProperty(value = "分享者是否拥有节点权限", example = "true", position = 10)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean operatorHasPermission;
}
