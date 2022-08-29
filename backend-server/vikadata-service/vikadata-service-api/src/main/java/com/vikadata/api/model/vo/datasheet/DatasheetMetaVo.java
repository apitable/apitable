package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * 数表Meta结果值
 *
 * @author Benson Cheung
 * @since 2019/10/7
 */
@ApiModel("数表Meta结果值")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class DatasheetMetaVo {

    @ApiModelProperty(value = "fieldMap和viewMap数据", position = 3)
    private JSONObject meta;
}
