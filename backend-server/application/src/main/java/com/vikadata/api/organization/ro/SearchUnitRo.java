package com.vikadata.api.organization.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

/**
 * <p>
 * Search Org Unit Request Parameters
 * </p>
 */
@Data
@ApiModel("Search Org Unit Request Parameters")
public class SearchUnitRo {

    @ApiModelProperty(value = "Name List", required = true, example = "Zhang San, Li Si", position = 1)
    @NotBlank(message = "Name list cannot be empty")
    private String names;

    @ApiModelProperty(value = "Association ID: node sharing ID, template ID", dataType = "java.lang.String", example = "shr8T8vAfehg3yj3McmDG", position = 2)
    private String linkId;
}
