package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 手动执行企微服务商事件
 * </p>
 * @author 刘斌华
 * @date 2022-06-07 18:32:05
 */
@Data
@ApiModel("手动执行企微服务商事件")
public class WeComIsvEventRo {

    @ApiModelProperty("事件 ID")
    @NotNull
    private Long eventId;

}
