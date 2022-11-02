package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * OneAccess delete organization information
 */
@Data
@ApiModel("OneAccess delete organization information")
public class OneAccessOrgDeleteRo extends OneAccessBaseRo {

    @ApiModelProperty(value = "orgId", example = "1001")
    @NotBlank(message = "department name")
    private String bimOrgId;

}
