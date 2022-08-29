package com.vikadata.api.model.vo.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序商店列表扩展信息视图
 * </p>
 * @author Pengap
 * @date 2021/9/16 13:40:33
 */
@Data
@ApiModel("小程序商店列表扩展信息视图")
public class WidgetStoreListExtraInfo {

    @ApiModelProperty(value = "小程序官网地址", position = 1)
    private String website;

}
