package com.vikadata.api.player.ro;

import javax.validation.constraints.Max;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * User notification paging list parameters
 * </p>
 */
@Data
@ApiModel("User notification paging list parameters")
public class NotificationPageRo {
    @Max(1)
    @ApiModelProperty(value = "Read 1 Read, 0 Unread, Not Transferred means to query all", allowableValues = "range[0,1]", dataType = "Integer",
        example = "0")
    private Integer isRead;

    @ApiModelProperty(value = "Notification Type", example = "system")
    private String notifyType;

    @ApiModelProperty(value = "The earliest notification line number", example = "10")
    private Integer rowNo;

    @ApiModelProperty(value = "Number of entries per page", example = "20")
    private Integer pageSize = 20;
}
