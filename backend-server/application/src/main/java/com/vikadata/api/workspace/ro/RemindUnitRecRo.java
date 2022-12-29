package com.vikadata.api.workspace.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Org Unit and Record Request Parameters
 * </p>
 */
@Data
@ApiModel("Org Unit and Record Request Parameters")
public class RemindUnitRecRo {

    @ApiModelProperty(value = "Record ID List", example = "[\"rec037CbsaKcN\",\"recFa9VgsXMrS\"]", position = 1)
    private List<String> recordIds;

    @ApiModelProperty(value = "Org Unit ID List", example = "[1217029304827183105,1217029304827183106]", position = 2, required = true)
    @NotEmpty(message = "The organizational unit list cannot be empty")
    private List<Long> unitIds;

    @ApiModelProperty(value = "Record Title", example = "This is a record", position = 3)
    private String recordTitle;

    @ApiModelProperty(value = "Column name", example = "This is a column name", position = 4)
    private String fieldName;
}
