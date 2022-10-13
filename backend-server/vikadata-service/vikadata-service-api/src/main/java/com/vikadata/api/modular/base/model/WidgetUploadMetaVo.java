package com.vikadata.api.modular.base.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * widget upload meta
 * @author tao
 */
@Data
@ApiModel("widget upload meta")
@Builder
public class WidgetUploadMetaVo {

    @ApiModelProperty(value = "cdn", position = 1)
    private String endpoint;

}