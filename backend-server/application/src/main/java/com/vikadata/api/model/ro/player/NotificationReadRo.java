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
@ApiModel("User marked read notification")
public class NotificationReadRo {
    @ApiModelProperty(value = "Notification ID, supporting batch", example = "[\"124324324\",\"243242\"]", required = true)
    private String[] id;

    @Max(1)
    @ApiModelProperty(value = "Full 1 full, 0 incomplete", allowableValues = "range[0,1]", dataType = "Integer",
            example = "0")
    private Integer isAll;
}
