package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 部门添加成员信息请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/20 10:50
 */
@Data
@ApiModel("部门添加成员信息请求参数")
public class TeamAddMemberRo {

    @ApiModelProperty(value = "部门ID,非必传，如果是根部门，可以不传输", dataType = "java.lang.String", required = true, example = "12032", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @ApiModelProperty(value = "部门或成员列表", required = true, position = 2)
    private List<OrgUnitRo> unitList;
}
