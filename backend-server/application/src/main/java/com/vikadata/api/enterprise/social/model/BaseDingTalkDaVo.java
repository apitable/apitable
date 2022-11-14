package com.vikadata.api.enterprise.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Setter;

/**
 * <p> 
 * Ding Talk callback basic information return
 * </p>
 */
@ApiModel("Ding Talk callback basic information return")
@Data
@Setter
public class BaseDingTalkDaVo {
    @ApiModelProperty(value = "Success or not")
    private Boolean success;

    @ApiModelProperty(value = "Error code, which must be returned when success is false")
    private Integer errCode;

    @ApiModelProperty(value = "Error information, which must be returned when success is false")
    private String errMsg;

    @ApiModelProperty(value = "Error information, which must be returned when success is false")
    private Object result;
}
