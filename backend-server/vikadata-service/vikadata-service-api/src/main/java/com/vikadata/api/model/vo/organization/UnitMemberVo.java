package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 成员单位视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/21 01:29
 */
@Data
@ApiModel("成员单位视图")
public class UnitMemberVo {

    @ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "用户ID(实际返回是uuid)", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "用户UUID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "成员名称(不加高亮标签)", example = "张三", position = 3)
    private String originName;

    @ApiModelProperty(value = "成员名称", example = "研发部｜张三", position = 3)
    private String memberName;

    @ApiModelProperty(value = "成员邮箱地址", example = "123456@vikadata.com", position = 4)
    private String email;

    @ApiModelProperty(value = "成员手机号码", example = "136****9061", position = 5)
    private String mobile;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "成员头像", example = "http://www.vikadata.com/image.png", position = 6)
    private String avatar;

    @ApiModelProperty(value = "是否已激活", example = "true", position = 7)
    private Boolean isActive;

    @ApiModelProperty(value = "成员所属部门", example = "运营部｜产品部｜研发部", position = 8)
    private String teams;

    @ApiModelProperty(value = "是否是管理员", example = "false", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 8)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 9)
    private Boolean isMemberNameModified;

}
