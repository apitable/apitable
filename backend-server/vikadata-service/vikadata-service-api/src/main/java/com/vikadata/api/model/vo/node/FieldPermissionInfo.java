package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.model.vo.datasheet.FieldRoleSetting;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * 字段权限视图信息
 * @author Shawn Deng
 * @date 2021-04-15 10:24:47
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("字段权限视图信息")
public class FieldPermissionInfo {

    @ApiModelProperty(value = "字段ID", example = "fldUQZGaNqSg2", position = 1)
    private String fieldId;

    @ApiModelProperty(value = "数表字段角色配置属性", position = 2)
    private FieldRoleSetting setting;

    @ApiModelProperty(value = "是否拥有权限", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasRole;

    @ApiModelProperty(value = "角色", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String role;

    @ApiModelProperty(value = "是否可以管理列角色", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean manageable;

    @ApiModelProperty(value = "字段权限集", position = 6)
    private FieldPermission permission;
}
