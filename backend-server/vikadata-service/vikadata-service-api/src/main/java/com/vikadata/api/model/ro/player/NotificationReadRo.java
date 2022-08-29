package com.vikadata.api.model.ro.player;

import javax.validation.constraints.Max;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 用户通知列表参数
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/12 2:27 下午
 */
@Data
@ApiModel("用户标记已读通知")
public class NotificationReadRo {
    @ApiModelProperty(value = "通知ID,支持批量", example = "[\"124324324\",\"243242\"]", required = true)
    private String[] id;

    @Max(1)
    @ApiModelProperty(value = "是否全量1全量,0非全量", allowableValues = "range[0,1]", dataType = "Integer",
            example = "0")
    private Integer isAll;
}
