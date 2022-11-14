package com.vikadata.api.organization.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Department Add Member Information Request Parameters
 * </p>
 */
@Data
@ApiModel("Department Add Member Information Request Parameters")
public class TeamAddMemberRo {

    @ApiModelProperty(value = "Department ID, not required. If it is the root department, it can not be transferred", dataType = "java.lang.String", required = true, example = "12032", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Department or member list", required = true, position = 2)
    private List<OrgUnitRo> unitList;
}
