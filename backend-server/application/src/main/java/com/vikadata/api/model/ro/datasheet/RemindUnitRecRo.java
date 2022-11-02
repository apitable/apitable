package com.vikadata.api.model.ro.datasheet;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 组织单元和记录请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/6/8
 */
@Data
@ApiModel("组织单元和记录请求参数")
public class RemindUnitRecRo {

    @ApiModelProperty(value = "记录ID列表", example = "[\"rec037CbsaKcN\",\"recFa9VgsXMrS\"]", position = 1)
    private List<String> recordIds;

    @ApiModelProperty(value = "组织单元ID列表", example = "[1217029304827183105,1217029304827183106]", position = 2, required = true)
    @NotEmpty(message = "组织单元列表不能为空")
    private List<Long> unitIds;

    @ApiModelProperty(value = "记录标题", example = "这是一个记录", position = 3)
    private String recordTitle;

    @ApiModelProperty(value = "列名", example = "这是一个列名", position = 4)
    private String fieldName;
}
