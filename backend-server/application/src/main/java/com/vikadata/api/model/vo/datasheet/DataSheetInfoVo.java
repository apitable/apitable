package com.vikadata.api.model.vo.datasheet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.model.vo.node.NodePermissionView;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * Result view of data table information
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@ApiModel("Result view of data table information")
public class DataSheetInfoVo {

    @ApiModelProperty(value = "Node Description", position = 1)
    private String description;

    @ApiModelProperty(value = "Whether the node is shared", position = 1)
    private Boolean nodeShared;

    @ApiModelProperty(value = "Whether the node permission is set", position = 2)
    private Boolean nodePermitSet;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Digital meter icon", example = "smile", position = 2)
    private String icon;

    @ApiModelProperty(value = "Number table name", example = "E-commerce project workbench", position = 2)
    private String name;

    @ApiModelProperty(value = "Number table custom ID", position = 3)
    private String id;

    @ApiModelProperty(value = "Parent Node Id", example = "nod10", position = 4)
    private String parentId;

    @ApiModelProperty(value = "Version No", example = "0", position = 4)
    private Long revision;

    @ApiModelProperty(value = "Owner", position = 7)
    private Long ownerId;

    @ApiModelProperty(value = "Creator", position = 8)
    private Long creatorId;

    @ApiModelProperty(value = "Space id", position = 9)
    private String spaceId;

    @ApiModelProperty(value = "Role", example = "editor", position = 13)
    private String role;

    @ApiModelProperty(value = "Node Permissions", position = 14)
    private NodePermissionView permissions;
}
