package com.vikadata.api.model.ro.player;

import javax.validation.constraints.Max;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/** 
* <p> 
* User notification list parameters
* </p>
*/
@Data
@ApiModel("User notification list parameters")
public class NotificationListRo {
    @Max(1)
    @ApiModelProperty(value = "Read 1 Read, 0 Unread, Default Unread", allowableValues = "range[0,1]",
            dataType = "Integer",
        example = "1")
    private Integer isRead = 0;

    @ApiModelProperty(value = "Notification type, default to system notification system", example = "system")
    private String notifyType = "system";
}
