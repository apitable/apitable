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
 * 用户基本信息
 * </p>
 *
 * @author zoe zheng
 */
@Data
@ApiModel("用户基本信息")
@Builder
public class PlayerBaseVo {

    @ApiModelProperty(value = "用户的Uuid", example = "aadddbccc")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "成员ID", example = "1261273764218")
    @JsonSerialize(using = ToStringSerializer.class, nullsUsing = NullStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "用户名称", example = "zoe")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userName;

    @ApiModelProperty(value = "成员名称", example = "zoe zheng")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "头像", example = "zoe zheng")
    private String avatar;

    @ApiModelProperty(value = "所属部门", example = "运营部｜策划部")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String team;

    @ApiModelProperty(value = "用户（user）是否修改过昵称")
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称")
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "邮箱", example = "52906715@qq.com")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String email;

    @Deprecated
    @ApiModelProperty(value = "是否已移除空间站", example = "true", hidden = true)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isDeleted;

    @ApiModelProperty(value = "用户player类型1: 空间内成员，并且没有被移除，2 空间外成员已经被移除，3 访客（非空间已登陆/注册用户）", example = "1")
    private Integer playerType;
}
