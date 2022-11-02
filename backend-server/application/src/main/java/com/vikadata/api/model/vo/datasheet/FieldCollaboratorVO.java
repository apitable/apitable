package com.vikadata.api.model.vo.datasheet;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * 数表字段角色信息视图
 * </p>
 *
 * @author Chambers
 * @date 2021/3/29
 */
@Data
@ApiModel("数表字段权限视图")
public class FieldCollaboratorVO {

    @ApiModelProperty(value = "是否开启", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enabled;

    @ApiModelProperty(value = "角色成员列表", position = 3)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<FieldRoleMemberVo> members;

    @ApiModelProperty(value = "角色组织单元列表", position = 4)
    private List<FieldRole> roles;

    @ApiModelProperty(value = "数表字段角色配置属性", position = 5)
    private FieldRoleSetting setting;
}
