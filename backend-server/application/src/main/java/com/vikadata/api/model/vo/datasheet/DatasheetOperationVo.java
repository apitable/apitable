package com.vikadata.api.model.vo.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

/**
 * <p>
 * Operation table of digital meter
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
@Accessors(chain = true)
@ApiModel("Operation table of digital meter")
public class DatasheetOperationVo {

    @ApiModelProperty(value = "Operation ID", position = 2)
    private String opId;

    @ApiModelProperty(value = "Datasheet ID", position = 3)
    private String dstId;

    @ApiModelProperty(value = "Operation name", position = 4)
    private String actionName;

    @ApiModelProperty(value = "Collection of operations", position = 5)
    private String actions;

    @ApiModelProperty(value = "Type 1-JOT 2-COT", position = 6)
    private Integer type;

    @ApiModelProperty(value = "Action member ID", position = 7)
    private Long memberId;

    @ApiModelProperty(value = "Version No", position = 8)
    private Long revision;


}
