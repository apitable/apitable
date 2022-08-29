package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 部门视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/21 19:09
 */
@Data
@ApiModel("部门视图")
public class TeamVo {

    @ApiModelProperty(value = "部门ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "部门名称", example = "研发部", position = 2)
    private String teamName;
}
