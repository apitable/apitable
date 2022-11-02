package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;

/**
 * <p>
 * 模版小程序包信息视图
 * </p>
 * @author Pengap
 * @date 2021/9/16 13:40:33
 */
@Data
@ApiModel("模版小程序包扩展信息视图")
public class WidgetTemplatePackageExtraInfo {

    @ApiModelProperty(value = "开源地址", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 1)
    @JsonSerialize(using = ImageSerializer.class)
    private String widgetOpenSource;

    @ApiModelProperty(value = "模版扩展封面图", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 2)
    @JsonSerialize(using = ImageSerializer.class)
    private String templateCover;

}
