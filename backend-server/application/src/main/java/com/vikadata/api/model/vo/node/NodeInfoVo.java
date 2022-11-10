package com.vikadata.api.model.vo.node;

import java.time.LocalDateTime;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.api.config.properties.LimitProperties;

/**
 * Search Node Results View
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("Node View")
public class NodeInfoVo extends BaseNodeInfo {

    @ApiModelProperty(value = "Space ID", example = "spc09", position = 4)
    private String spaceId;

    @ApiModelProperty(value = "Parent Node Id", example = "nod10", position = 4)
    private String parentId;

    @ApiModelProperty(value = "Previous node ID", example = "nod11", position = 5)
    private String preNodeId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Node icon", example = ":smile", position = 6)
    private String icon;

    @ApiModelProperty(value = "Whether there are sub nodes. The node type is folder", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildren;

    @ApiModelProperty(value = "Whether it belongs to the template node", hidden = true)
    @JsonIgnore
    private Boolean isTemplate;

    @ApiModelProperty(value = "Whether the node is shared", position = 7)
    private Boolean nodeShared;

    @ApiModelProperty(value = "Whether the node permission is set", position = 8)
    private Boolean nodePermitSet;

    @ApiModelProperty(value = "Whether the node is a star", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeFavorite;

    @ApiModelProperty(value = "When the node is a data table, whether the returned data table field has reached the upper limit", example = "true", position = 11)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnLimit;

    @ApiModelProperty(value = "Metadata of data table node - data table field set length", hidden = true)
    @JsonIgnore
    private Integer mdFieldMapSize;

    @ApiModelProperty(value = "Create time", dataType = "string", example = "2020-03-18T15:29:59.000", position = 12)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "Update time", dataType = "string", example = "2020-03-18T15:29:59.000", position = 13)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "Role", example = "editor", position = 14)
    private String role;

    @ApiModelProperty(value = "Node Permissions", position = 15)
    private NodePermissionView permissions;

    public Boolean getColumnLimit() {
        if (Objects.nonNull(this.mdFieldMapSize)) {
            LimitProperties properties = SpringContextHolder.getBean(LimitProperties.class);
            return this.mdFieldMapSize >= properties.getMaxColumnCount();
        }
        return false;
    }
}
