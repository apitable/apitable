package com.vikadata.api.model.ro.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 数表记录Record中Data的Field结构请求参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@ApiModel("数表记录Record中Data的Field结构请求参数")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class RecordDataRo {

    @ApiModelProperty(value = "记录值", position = 1)
    private String text;

    @ApiModelProperty(value = "字段类型", position = 2)
    private Integer type;




}
