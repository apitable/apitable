package com.vikadata.api.model.vo.organization;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 分页：成员列表视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("成员列表视图")
public class MemberPageVo {

    @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "头像地址", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
    private String avatar;

    @ApiModelProperty(value = "用户昵称", example = "这是一个用户昵称", position = 2)
    private String nickName;

    @ApiModelProperty(value = "成员姓名", example = "张三", position = 2)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "手机号码", example = "13344445555", position = 3)
    private String mobile;

    @ApiModelProperty(value = "电子邮箱", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "所属部门ID", example = "1,2,3", position = 6)
    private String teamIds;

    @ApiModelProperty(value = "所属部门", example = "研发部｜运营部｜设计部", position = 7)
    private String teams;

    @ApiModelProperty(value = "是否已激活", example = "true", position = 8)
    private Boolean isActive;

    @ApiModelProperty(value = "是否主管理员", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isPrimary;

    @ApiModelProperty(value = "是否子管理员", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isSubAdmin;

    @ApiModelProperty(value = "创建时间", example = "2020-03-18T15:29:59.000", position = 9)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "更新时间", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 11)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 12)
    private Boolean isMemberNameModified;

}
