package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 搜索部门结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/8 11:41
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@ApiModel("搜索部门结果视图")
public class SearchTeamResultVo {

    @ApiModelProperty(value = "部门ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "部门名称", example = "技术组", position = 2)
    private String teamName;

    @ApiModelProperty(value = "部门名称(不加高亮标签)", example = "技术组", position = 2)
    private String originName;

    @ApiModelProperty(value = "父级名称", example = "研发部", position = 3)
    private String parentName;

    @ApiModelProperty(value = "简称", example = "技", position = 4)
    private String shortName;

    @ApiModelProperty(value = "部门成员数量", example = "3", position = 4)
    private Integer memberCount;

    @ApiModelProperty(value = "是否有子部门", example = "true", position = 6)
    private Boolean hasChildren;
}
