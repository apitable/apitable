package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 获取小程序商店列表请参数
 * </p>
 * @author Pengap
 * @date 2021/9/28 14:43:31
 */
@Data
@ApiModel("小程序商店列表请参数")
public class WidgetStoreListRo {

    @ApiModelProperty(value = "是否过滤未发布的小程序（true:过滤,false:不过滤）", example = "false", position = 1)
    private Boolean filter;

    @NotNull
    @ApiModelProperty(value = "获取小程序类型（0:空间站，1:全局，10:待审核）", example = "1", position = 2)
    private Integer type;

    @ApiModelProperty(value = "指定返回语言", example = "zh-CN", position = 3, hidden = true)
    private String language;

    @ApiModelProperty(value = "待审核全局小程序搜索关键字", position = 4)
    private String previewSearchKeyword;

}
