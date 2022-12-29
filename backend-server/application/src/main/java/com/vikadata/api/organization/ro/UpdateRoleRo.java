package com.vikadata.api.organization.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 *     update role members request parameter
 * </p>
 *
 * @author tao
 */
@Data
@ApiModel("Update role members request")
public class UpdateRoleRo {

    @NotBlank
    @Size(min = 1, max = 100, message = "The role name cannot exceed 100 characters")
    @ApiModelProperty(value = "role name", required = true, example = "finance", position = 1)
    private String roleName;

}
