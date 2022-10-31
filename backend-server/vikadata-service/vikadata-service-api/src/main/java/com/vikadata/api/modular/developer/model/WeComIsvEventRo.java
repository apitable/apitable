package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("We ComIsv Event Ro")
public class WeComIsvEventRo {

    @ApiModelProperty("event ID")
    @NotNull
    private Long eventId;

}
