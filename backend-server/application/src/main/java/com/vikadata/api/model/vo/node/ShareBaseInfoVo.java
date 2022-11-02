package com.vikadata.api.model.vo.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 节点分享基本信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 14:16
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("节点分享基本信息视图")
public class ShareBaseInfoVo {

    @ApiModelProperty(value = "分享唯一编码", example = "shrKsX1map5RfYO", position = 1)
    private String shareId;
}
