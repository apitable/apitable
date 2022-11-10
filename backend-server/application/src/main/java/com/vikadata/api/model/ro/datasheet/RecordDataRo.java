package com.vikadata.api.model.ro.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Field structure request parameters of data in the datasheet record Record
 * </p>
 */
@ApiModel("Field structure request parameters of data in the datasheet record Record")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class RecordDataRo {

    @ApiModelProperty(value = "Record value", position = 1)
    private String text;

    @ApiModelProperty(value = "Field Type", position = 2)
    private Integer type;




}
