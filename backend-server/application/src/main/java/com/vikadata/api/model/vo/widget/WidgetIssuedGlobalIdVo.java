package com.vikadata.api.model.vo.widget;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Create Result View
 * </p>
 *
 * @author Pengap
 * @date 2021/7/9
 */
@Data
@ApiModel("Widget Issuing Global Id Result View")
public class WidgetIssuedGlobalIdVo {

    @ApiModelProperty(value = "Global Widget ID", position = 1)
    private String issuedGlobalId;

}
