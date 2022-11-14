package com.vikadata.api.workspace.ro;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * DataSheet Meta Operation Request Parameters
 */
@ApiModel("DataSheet Meta Operation Request Parameters")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class MetaOpRo {


    @ApiModelProperty(value = "fieldMap and viewMap Data", example = "", position = 3)
    private JSONObject meta;

    @ApiModelProperty(value = "Version No",example = "0", position = 4)
    private Long revision;

}
