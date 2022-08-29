package com.vikadata.api.model.ro.player;

import javax.validation.constraints.Max;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 用户通知分页列表参数
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/12 2:27 下午
 */
@Data
@ApiModel("用户通知分页列表参数")
public class NotificationPageRo {
    @Max(1)
    @ApiModelProperty(value = "是否已读1已读,0未读,不传代表查询全部", allowableValues = "range[0,1]", dataType = "Integer",
        example = "0")
    private Integer isRead;

    @ApiModelProperty(value = "通知类型", example = "system")
    private String notifyType;

    @ApiModelProperty(value = "最早的通知行号", example = "10")
    private Integer rowNo;

    @ApiModelProperty(value = "每页条数", example = "20")
    private Integer pageSize = 20;
}
