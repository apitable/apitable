package com.vikadata.api.model.ro.player;

import javax.validation.constraints.Max;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/** 
* <p> 
* 用户通知列表参数
* </p> 
* @author zoe zheng 
* @date 2021/3/1 10:16 上午
*/
@Data
@ApiModel("用户通知列表参数")
public class NotificationListRo {
    @Max(1)
    @ApiModelProperty(value = "是否已读1已读,0未读,默认未读", allowableValues = "range[0,1]",
            dataType = "Integer",
        example = "1")
    private Integer isRead = 0;

    @ApiModelProperty(value = "通知类型，默认为系统通知system", example = "system")
    private String notifyType = "system";
}
