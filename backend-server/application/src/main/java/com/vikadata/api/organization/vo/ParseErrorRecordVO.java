package com.vikadata.api.organization.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Resolution Failure Details View
 * </p>
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("Resolution Failure Details View")
public class ParseErrorRecordVO {

    @Deprecated
    @ApiModelProperty(value = "Number of rows", example = "Line 6", position = 1)
    private String rowIndex;

    @ApiModelProperty(value = "Row index", example = "1", position = 2)
    private Integer rowNumber;

    @ApiModelProperty(value = "Member nickname", example = "Zhang San", position = 3)
    private String name;

    @ApiModelProperty(value = "Email", example = "Line 6", position = 4)
    private String email;

    @ApiModelProperty(value = "Number of rows", example = "Line 6", position = 5)
    private String team;

    @ApiModelProperty(value = "Error Details", example = "Email not filled", position = 6)
    private String message;
}
