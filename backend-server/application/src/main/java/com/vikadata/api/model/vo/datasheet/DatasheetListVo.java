package com.vikadata.api.model.vo.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 数表视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/13 17:23
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("数表页面")
public class DatasheetListVo {

    @ApiModelProperty(value = "数表ID", position = 2)
    private String id;

    @ApiModelProperty(value = "名称", position = 3)
    private String name;

    @ApiModelProperty(value = "类型 0-无类型 1-数表", position = 4)
    private Integer type;

    @ApiModelProperty(value = "空间id", position = 5)
    private String spaceId;

    @ApiModelProperty(value = "拥有者userid", position = 6)
    private String ownerId;

    @ApiModelProperty(value = "创建者userid", position = 7)
    private String creatorId;

    @ApiModelProperty(value = "排序", position = 8)
    private Integer sequence;

    @ApiModelProperty(value = "版本号", position = 9)
    private Long revision;
}
