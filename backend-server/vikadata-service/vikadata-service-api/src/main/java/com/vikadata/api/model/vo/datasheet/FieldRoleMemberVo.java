package com.vikadata.api.model.vo.datasheet;

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
 * 节点成员视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/7/16 16:29
 */
@Data
@ApiModel("字段成员视图")
public class FieldRoleMemberVo {

    @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "成员名称", example = "研发部｜张三", position = 2)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "成员头像", example = "https://vika.cn/image.png", position = 3)
    private String avatar;

    @ApiModelProperty(value = "成员所属部门", example = "运营部｜产品部｜研发部", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String teams;

    @ApiModelProperty(value = "角色", example = "manager", position = 5)
    private String role;

    @ApiModelProperty(value = "组织单元是成员时，标注是否是管理员", example = "false", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;
}
