package com.vikadata.api.model.vo.datasheet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-12 00:19:37
 */
@Data
@ApiModel("数表字段角色视图")
public class FieldRole {

    @ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "组织单元名称", example = "研发部｜张三", position = 2)
    private String unitName;

    @ApiModelProperty(value = "类型：1-部门，2-标签，3-成员", example = "1", position = 3)
    private Integer unitType;

    @ApiModelProperty(value = "组织单元是成员时，标注是否是管理员", example = "false", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;

    @ApiModelProperty(value = "部门的成员数量，类型为部门时返回", example = "3", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "头像，类型为成员时返回", example = "https://www.vikadata.com/image.png", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "所属部门，类型为成员时返回", example = "运营部｜产品部｜研发部", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String teams;

    @ApiModelProperty(value = "角色", example = "manager", position = 7)
    private String role;

    @ApiModelProperty(value = "标注是否是字段权限拥有（开启）者", example = "false", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isOwner;

    @Deprecated
    @ApiModelProperty(value = "角色权限是否无效", example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean roleInvalid;

    @Deprecated
    @ApiModelProperty(value = "是否可以设置只读权限", example = "true", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canRead;

    @Deprecated
    @ApiModelProperty(value = "是否可以设置编辑权限", example = "true", position = 10)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canEdit;

    @Deprecated
    @ApiModelProperty(value = "是否可以移除权限", example = "true", position = 11)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean canRemove;

    @Deprecated
    @ApiModelProperty(value = "节点可管理标志（空间站管理员+节点可管理组织单元）", example = "true", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeManageable;

    @Deprecated
    @ApiModelProperty(value = "权限继承标志", example = "true", position = 13)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean permissionExtend;
}
