package com.vikadata.api.model.vo.player;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Basic user information
 * </p>
 */
@Data
@ApiModel("Basic user information")
@Builder
public class PlayerBaseVo {

    @ApiModelProperty(value = "User's Uuid", example = "aadddbccc")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Member ID", example = "1261273764218")
    @JsonSerialize(using = ToStringSerializer.class, nullsUsing = NullStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "User Name", example = "zoe")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userName;

    @ApiModelProperty(value = "Member Name", example = "zoe zheng")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "HEAD PORTRAIT", example = "zoe zheng")
    private String avatar;

    @ApiModelProperty(value = "DEPARTMENT", example = "Operation Department｜Planning Department")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String team;

    @ApiModelProperty(value = "Whether the user has modified the nickname")
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname")
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "Email", example = "52906715@qq.com")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String email;

    @Deprecated
    @ApiModelProperty(value = "Whether the space station has been removed", example = "true", hidden = true)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isDeleted;

    @ApiModelProperty(value = "User player type 1: members in the space have not been removed, 2 members outside the space have been removed, and 3 visitors (non space registered users)", example = "1")
    private Integer playerType;
}
