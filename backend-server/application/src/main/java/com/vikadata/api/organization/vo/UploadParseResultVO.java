package com.vikadata.api.organization.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Template resolution result view
 * </p>
 */
@Data
@ApiModel("Template resolution result view、")
public class UploadParseResultVO {

    @ApiModelProperty(value = "Total number of resolutions", example = "100", position = 1)
    private Integer rowCount;

    @ApiModelProperty(value = "Number of successful parsing", example = "198", position = 2)
    private Integer successCount;

    @ApiModelProperty(value = "Number of failed parsing", example = "2", position = 3)
    private Integer errorCount;

    private List<ParseErrorRecordVO> errorList;
}
