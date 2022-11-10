package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;

/**
 * <p>
 * Template Widget Package Information View
 * </p>
 */
@Data
@ApiModel("Template Widget Package Extension Information View")
public class WidgetTemplatePackageExtraInfo {

    @ApiModelProperty(value = "Open source address", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 1)
    @JsonSerialize(using = ImageSerializer.class)
    private String widgetOpenSource;

    @ApiModelProperty(value = "Template Extension Cover", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 2)
    @JsonSerialize(using = ImageSerializer.class)
    private String templateCover;

}
