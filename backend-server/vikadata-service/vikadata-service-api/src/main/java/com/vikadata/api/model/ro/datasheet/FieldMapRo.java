package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 数表字段请求参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@ApiModel("数表字段请求参数")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class FieldMapRo {

    @ApiModelProperty(value = "字段自定义Id", position = 2)
    private String id;

    @ApiModelProperty(value = "字段名称", position = 3)
    private String name;

    @ApiModelProperty(value = "描述", position = 4)
    private String desc;

    @ApiModelProperty(value = "字段类型 1-文本「Text」2-数字「NUMBER」 3-单选 「SINGLESELECT」4-多选「MULTISELECT」 5-日期「DATETIME」 6-附件「ATTACHMENT」 7-关联「LINK」", position = 5)
    private Integer type;

    @ApiModelProperty(value = "属性", position = 6)
    private JSONObject property;

    @ApiModelProperty(value = "是否设置为表单必填项", position = 7)
    private Boolean required;
}
