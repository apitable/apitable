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
 * 搜索节点结果视图
 *
 * @author Chambers
 * @since 2019/10/9
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("节点视图")
public class NodeInfoVo extends BaseNodeInfo {

    @ApiModelProperty(value = "空间ID", example = "spc09", position = 4)
    private String spaceId;

    @ApiModelProperty(value = "父节点Id", example = "nod10", position = 4)
    private String parentId;

    @ApiModelProperty(value = "前一个节点ID", example = "nod11", position = 5)
    private String preNodeId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "节点图标", example = ":smile", position = 6)
    private String icon;

    @ApiModelProperty(value = "是否有子节点，节点类型为文件夹", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildren;

    @ApiModelProperty(value = "是否属于模板节点", hidden = true)
    @JsonIgnore
    private Boolean isTemplate;

    @ApiModelProperty(value = "节点是否被分享", position = 7)
    private Boolean nodeShared;

    @ApiModelProperty(value = "节点权限是否被设置", position = 8)
    private Boolean nodePermitSet;

    @ApiModelProperty(value = "节点是否是星标", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeFavorite;

    @ApiModelProperty(value = "节点为数表时，返回数表字段是否已达到上限", example = "true", position = 11)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean columnLimit;

    @ApiModelProperty(value = "数表节点的元数据-数表字段集合长度", hidden = true)
    @JsonIgnore
    private Integer mdFieldMapSize;

    @ApiModelProperty(value = "创建时间", dataType = "string", example = "2020-03-18T15:29:59.000", position = 12)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "更新时间", dataType = "string", example = "2020-03-18T15:29:59.000", position = 13)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "角色", example = "editor", position = 14)
    private String role;

    @ApiModelProperty(value = "节点权限", position = 15)
    private NodePermissionView permissions;

    public Boolean getColumnLimit() {
        if (Objects.nonNull(this.mdFieldMapSize)) {
            LimitProperties properties = SpringContextHolder.getBean(LimitProperties.class);
            return this.mdFieldMapSize >= properties.getMaxColumnCount();
        }
        return false;
    }
}
