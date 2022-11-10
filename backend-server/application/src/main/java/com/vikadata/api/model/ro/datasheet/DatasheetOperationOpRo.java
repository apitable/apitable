package com.vikadata.api.model.ro.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.io.Serializable;

/**
 * <p>
 * DataSheet Operation Request Parameters
 * </p>
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ApiModel("DataSheet Operation Request Parameters")
public class DatasheetOperationOpRo  {



    @ApiModelProperty(value = "Operation ID", position = 2)
    private String opId;

    @ApiModelProperty(value = "Meter ID", position = 3)
    private String dstId;

    @ApiModelProperty(value = "Operation name", position = 4)
    private String actionName;

    @ApiModelProperty(value = "Collection of operations", position = 5)
    private String actions;

    @ApiModelProperty(value = "Type 1-JOT 2-COT", position = 6)
    private Integer type;

    @ApiModelProperty(value = "Action member ID", position = 7)
    private Long memberId;

    @ApiModelProperty(value = "Version", position = 8)
    private Long revision;


}
