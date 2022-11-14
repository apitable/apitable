package com.vikadata.api.workspace.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Mention member request parameters
 * </p>
 */
@Data
@ApiModel("Mention member request parameters")
public class RemindMemberRo {

    @ApiModelProperty(value = "Whether to enable notification", example = "true", required = true)
    @NotNull(message = "Whether to enable notification cannot be blank")
    private Boolean isNotify;

    @ApiModelProperty(value = "Node ID", example = "dstiHMuQnhWkVxBKkU", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "View ID", example = "viwwkxEZ3XaDg", position = 2)
    private String viewId;

    @ApiModelProperty(value = "Organizational Unit and Record List", position = 3, required = true)
    @NotEmpty(message = "Organizational unit and record list cannot be empty")
    private List<RemindUnitRecRo> unitRecs;

    @ApiModelProperty(value = "Association ID: node sharing ID, template ID", example = "shr8T8vAfehg3yj3McmDG", position = 4)
    private String linkId;

    @ApiModelProperty(value = "Type of notification: 1 member notification, 2 comment notification", example = "1", position = 5)
    private Integer type = 1;

    @ApiModelProperty(value = "Send additional content of email notification", example = "@aaa&nbsp;&nbsp;Incorrect", position = 6)
    private RemindExtraRo extra = null;
}
