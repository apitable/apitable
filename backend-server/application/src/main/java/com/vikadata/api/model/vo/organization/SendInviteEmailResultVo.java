package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Send Invitation Message Result View
 * </p>
 */
@Data
@ApiModel("Send Invitation Message Result View")
public class SendInviteEmailResultVo {

    @ApiModelProperty(value = "Total sent", example = "1", position = 1)
    private int total;

    @ApiModelProperty(value = "Number of successful sending", example = "1", position = 1)
    private int success;

    @ApiModelProperty(value = "Number of sending failures", example = "1", position = 1)
    private int error;

    @ApiModelProperty(value = "Whether the mailbox has been bound", example = "true", position = 4)
    private Boolean isBound;
}
