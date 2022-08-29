package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.util.List;

/**
 * 数表SnapshotOP操作请求参数
 *
 * @author Benson Cheung
 * @since 2019/10/7
 */
@ApiModel("数表SnapshotOP操作请求参数")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class OperationMapRo {

    @ApiModelProperty(value = "操作指令", position = 1)
    private  String cmd;

    @ApiModelProperty(value = "数表记录集合", position = 2)
    private List<JSONObject> actions;
}
