package com.vikadata.api.model.ro.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序审核-待审查列表请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序审核-待审查列表请求参数")
public class WidgetAuditWaitReviewListRo {

    @ApiModelProperty(value = "审核小程序名称", position = 1)
    private String searchKeyword;

    @ApiModelProperty(value = "指定返回语言", example = "zh-CN", position = 3, hidden = true)
    private String language;

}
