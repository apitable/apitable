package com.vikadata.api.organization.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 *      Add role members request parameter
 * </p>
 */
@Data
@ApiModel("Add role members request")
public class AddRoleMemberRo {

    @NotEmpty
    @ApiModelProperty(value = "team or member", required = true, position = 1)
    private List<RoleMemberUnitRo> unitList;

}
