package com.vikadata.api.model.ro.labs;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * GM命令创建实验性功能表 请求对象
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/22 00:55:08
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("实验性功能表 请求对象")
public class GmLabsFeatureCreatorRo {

    @ApiModelProperty(value = "实验性功能级别", dataType = "java.lang.String", example = "user|space", position = 1)
    private String scope;

    @ApiModelProperty(value = "实验室功能唯一标识", dataType = "java.lang.String", example = "render_prompt|async_compute|robot|widget_center", position = 2)
    private String key;

    @ApiModelProperty(value = "实验室功能上架类型", dataType = "java.lang.String", example = "static|review|normal", position = 3)
    private String type;

    @ApiModelProperty(value = "实验室功能神奇表单地址", dataType = "java.lang.String", position = 4)
    private String url;
}
