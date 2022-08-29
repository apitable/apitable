package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 节点成员视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/7/16 16:29
 */
@Data
@ApiModel("节点成员视图")
public class NodeRoleMemberVo {

    @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "成员名称", example = "研发部｜张三", position = 1)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "成员头像", example = "http://www.vikadata.com/image.png", position = 2)
    private String avatar;

    @ApiModelProperty(value = "成员所属部门", example = "运营部｜产品部｜研发部", position = 3)
    private String teams;

    @ApiModelProperty(value = "角色", example = "manager", position = 4)
    private String role;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 5)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 6)
    private Boolean isMemberNameModified;

    @JsonIgnore
    private String uuid;

    @JsonIgnore
    private Boolean isAdmin;
}
