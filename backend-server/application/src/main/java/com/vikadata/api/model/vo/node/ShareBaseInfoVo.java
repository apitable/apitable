package com.vikadata.api.model.vo.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Node sharing basic information view
 * </p>
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("Node sharing basic information view")
public class ShareBaseInfoVo {

    @ApiModelProperty(value = "Share unique code", example = "shrKsX1map5RfYO", position = 1)
    private String shareId;
}
