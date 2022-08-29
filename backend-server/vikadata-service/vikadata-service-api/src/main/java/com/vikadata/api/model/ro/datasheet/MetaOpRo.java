package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * 数表Meta操作请求参数
 *
 * @author Benson Cheung
 * @since 2019/10/7
 */
@ApiModel("数表Meta操作请求参数")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class MetaOpRo {


    @ApiModelProperty(value = "fieldMap和viewMap数据", example = "", position = 3)
    private JSONObject meta;

    @ApiModelProperty(value = "版本号",example = "0", position = 4)
    private Long revision;

}
