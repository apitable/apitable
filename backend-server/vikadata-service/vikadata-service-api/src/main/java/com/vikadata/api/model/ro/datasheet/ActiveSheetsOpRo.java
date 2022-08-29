package com.vikadata.api.model.ro.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 活跃节点请求参数
 * </p>
 *
 * @author Chambers
 * @date 2019/11/18
 */
@Data
@ApiModel("活跃节点请求参数")
public class ActiveSheetsOpRo {

    @ApiModelProperty(value = "活跃节点id", example = "dst15", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "活跃数表的视图id", example = "views135", position = 2)
    private String viewId;

    @ApiModelProperty(value = "位置(0:工作目录;1:星标)", example = "1", position = 3)
    private Integer position;

}
