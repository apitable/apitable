package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 模版小程序包信息视图
 * </p>
 * @author Pengap
 * @date 2021/9/16 13:40:33
 */
@Data
@ApiModel("模版小程序包信息视图")
public class WidgetTemplatePackageInfo {

    @ApiModelProperty(value = "小程序包ID", example = "wpkABC", position = 1)
    private String widgetPackageId;

    @ApiModelProperty(value = "小程序包名称", example = "图表", position = 2)
    private String name;

    @ApiModelProperty(value = "小程序包图标", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "小程序包封面图", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "描述", example = "这是一个图表小程序的描述", position = 5)
    private String description;

    @ApiModelProperty(value = "小程序包版本号", example = "1.0.0", position = 6)
    private String version;

    @ApiModelProperty(value = "代码地址", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 7)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "源代码地址", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 8)
    @JsonSerialize(using = ImageSerializer.class)
    private String sourceCodeBundle;

    @ApiModelProperty(value = "小程序包扩展信息", position = 9)
    private WidgetTemplatePackageExtraInfo extras;

}
