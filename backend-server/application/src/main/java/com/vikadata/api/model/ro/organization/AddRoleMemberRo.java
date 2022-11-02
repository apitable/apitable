package com.vikadata.api.model.ro.organization;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 *      Add role members request parameter
 * </p>
 *
 * @author tao
 */
@Data
@ApiModel("Add role members request")
public class AddRoleMemberRo {

    @NotEmpty
    @ApiModelProperty(value = "team or member", required = true, position = 1)
    private List<RoleMemberUnitRo> unitList;

}
