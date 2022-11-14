package com.vikadata.api.base.model;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * widget upload file callback body
 *
 * @author tao
 */
@Data
@ApiModel("widget upload callback body")
public class WidgetUploadNotifyRO {

    @ApiModelProperty(value = "file url. max: 20", example = "[\"widget/asset/adflkajadfj\"]", position = 1)
    @NotEmpty(message = "resourceKeys no empty")
    private List<String> resourceKeys;

}