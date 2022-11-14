package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Node Member View
 * </p>
 */
@Data
@ApiModel("Node Member View")
public class NodeRoleMemberVo {

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Member Name", example = "R&D Department ｜ Zhang San", position = 1)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Member avatar", example = "http://www.vikadata.com/image.png", position = 2)
    private String avatar;

    @ApiModelProperty(value = "Member's Department", example = "Operation Department | Product Department | R&D Department", position = 3)
    private String teams;

    @ApiModelProperty(value = "Role", example = "manager", position = 4)
    private String role;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 5)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 6)
    private Boolean isMemberNameModified;

    @JsonIgnore
    private String uuid;

    @JsonIgnore
    private Boolean isAdmin;
}
