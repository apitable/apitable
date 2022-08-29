package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 部门单位视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/21 01:29
 */
@Data
@ApiModel("部门单位视图")
public class UnitTeamVo {

    @ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "小组ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "小组名称", example = "研发部 ｜ 张三", position = 3)
    private String teamName;

    @ApiModelProperty(value = "部门名称(不加高亮标签)", example = "技术组", position = 3)
    private String originName;

    @ApiModelProperty(value = "成员数量", example = "3", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "是否有子部门和成员", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildren;

    @ApiModelProperty(value = "是否有子部门", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildrenTeam;
}
