package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 数表视图参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@ApiModel("数表视图map参数")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class ViewMapRo {

    @ApiModelProperty(value = "自定义视图ID",position = 1)
    private String id;

    @ApiModelProperty(value = "视图名称", position = 2)
    private String name;

    @ApiModelProperty(value = "视图「行」", position = 3)
    private JSONArray rows;

    @ApiModelProperty(value = "视图「列」", position = 4)
    private JSONArray columns;

    @ApiModelProperty(value = "视图属性", position = 5)
    private String property;

    @ApiModelProperty(value = "视图类型 1-数表「Grid」", position = 6)
    private Integer type;

    @ApiModelProperty(value = "视图描述", position = 7)
    private String description;

    @ApiModelProperty(value = "冻结视图列数，从第一列开始，默认为1", position = 7)
    private Integer frozenColumnCount;

    @ApiModelProperty(value = "视图隐藏选项", position = 8)
    private Boolean hidden;

    @ApiModelProperty(value = "筛选项", position = 9)
    private JSONObject filterInfo;

    @ApiModelProperty(value = "排序", position = 11)
    private JSONArray sortInfo;

    @ApiModelProperty(value = "行高", position = 12)
    private Integer rowHeightLevel;

    @ApiModelProperty(value = "分组", position = 13)
    private JSONArray groupInfo;

    @ApiModelProperty(value = "相册视图样式", position = 14)
    private JSONObject style;
}
