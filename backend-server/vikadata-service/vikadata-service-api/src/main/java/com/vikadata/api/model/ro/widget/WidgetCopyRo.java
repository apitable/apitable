package com.vikadata.api.model.ro.widget;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序复制请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
@Data
@ApiModel("小程序复制请求参数")
public class WidgetCopyRo {

    @ApiModelProperty(value = "仪表盘ID", required = true, example = "dsb11", position = 1)
    @NotBlank(message = "仪表盘ID 不能为空")
    private String dashboardId;

    @ApiModelProperty(value = "小程序ID 列表", required = true, example = "[\"wdtiJjVmNFcFmNtQFA\", \"wdtSbp8TkH7gTGAYR1\"]", position = 2)
    @NotEmpty(message = "小程序ID 列表 不能为空")
    private List<String> widgetIds;
}
