package com.vikadata.api.cache.bean;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户对应空间已打开的数表
 *
 * @author Chambers
 * @since 2019/11/4
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OpenedSheet {

    @ApiModelProperty(value = "数表节点ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "数表的视图id", example = "views135", position = 2)
    private String viewId;

    @ApiModelProperty(value = "位置(0:工作目录;1:星标)", example = "1", position = 3)
    private Integer position;
}
