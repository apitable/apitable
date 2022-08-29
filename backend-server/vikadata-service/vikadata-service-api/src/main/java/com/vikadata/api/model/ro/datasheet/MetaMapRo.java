package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * 数表meta集合参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@ApiModel("数表meta集合参数")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class MetaMapRo {

    @ApiModelProperty(value = "数表字段集合", position = 2)
    private JSONObject fieldMap;

    @ApiModelProperty(value = "视图数组（存viewId）", position = 3)
    private JSONArray views;

    @ApiModelProperty(value = "组件面板", position = 4)
    private JSONArray widgetPanels;
}
