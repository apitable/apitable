package com.vikadata.api.model.ro.datasheet;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Comment on specific content
 * </p>
 */
@Data
@ApiModel("Other reminders")
public class RemindExtraRo {

    @Deprecated
    @ApiModelProperty(value = "Record Title", example = "First column", position = 1, required = true)
    private String recordTitle;

    @ApiModelProperty(value = "Comments", example = "@zoe&nbsp;&nbsp;Comments", position = 2, required = true)
    @NotEmpty(message = "Comments")
    private String content;

    @Deprecated
    @ApiModelProperty(value = "Comment time", example = "2020.11.26 10:30:36", position = 3, required = true)
    @NotEmpty(message = "Comment time")
    private String createdAt;

}
