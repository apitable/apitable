package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * 数表Snapshot操作请求参数
 *
 * @author Benson Cheung
 * @since 2019/10/7
 */
@ApiModel("数表Snapshot操作请求参数")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class SnapshotMapRo {

    @ApiModelProperty(value = "数表meta集合", position = 2)
    private JSONObject meta;

    @ApiModelProperty(value = "数表记录集合", position = 3)
    private JSONObject recordMap;
}
