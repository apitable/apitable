package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Node Member View
 * </p>
 */
@Data
@ApiModel("Field Member View")
public class FieldRoleMemberVo {

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Member Name", example = "R&D Department ｜ Zhang San", position = 2)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Member avatar", example = "https://vika.cn/image.png", position = 3)
    private String avatar;

    @ApiModelProperty(value = "Member's Department", example = "Operation Department | Product Department | R&D Department", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String teams;

    @ApiModelProperty(value = "Role", example = "manager", position = 5)
    private String role;

    @ApiModelProperty(value = "When an organization unit is a member, indicate whether it is an administrator", example = "false", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;
}
