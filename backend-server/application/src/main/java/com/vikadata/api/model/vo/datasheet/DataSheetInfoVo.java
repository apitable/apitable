package com.vikadata.api.model.vo.datasheet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.model.vo.node.NodePermissionView;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * 数表信息的结果视图
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@ApiModel("数表信息的结果视图")
public class DataSheetInfoVo {

    @ApiModelProperty(value = "节点描述", position = 1)
    private String description;

    @ApiModelProperty(value = "节点是否被分享", position = 1)
    private Boolean nodeShared;

    @ApiModelProperty(value = "节点权限是否被设置", position = 2)
    private Boolean nodePermitSet;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "数表icon", example = "smile", position = 2)
    private String icon;

    @ApiModelProperty(value = "数表名称", example = "电商项目工作台", position = 2)
    private String name;

    @ApiModelProperty(value = "数表自定义ID", position = 3)
    private String id;

    @ApiModelProperty(value = "父节点Id", example = "nod10", position = 4)
    private String parentId;

    @ApiModelProperty(value = "版本号", example = "0", position = 4)
    private Long revision;

    @ApiModelProperty(value = "拥有者", position = 7)
    private Long ownerId;

    @ApiModelProperty(value = "创建者", position = 8)
    private Long creatorId;

    @ApiModelProperty(value = "空间id", position = 9)
    private String spaceId;

    @ApiModelProperty(value = "角色", example = "editor", position = 13)
    private String role;

    @ApiModelProperty(value = "节点权限", position = 14)
    private NodePermissionView permissions;
}
