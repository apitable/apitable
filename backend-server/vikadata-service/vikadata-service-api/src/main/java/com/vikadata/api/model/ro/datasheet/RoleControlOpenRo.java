package com.vikadata.api.model.ro.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 节点、字段角色控制打开请求参数
 * @author tao
 */
@Data
@ApiModel("空间管理 - 节点、字段角色控制打开 请求参数")
public class RoleControlOpenRo {

    @ApiModelProperty(value = "开启时是否继承角色", example = "true", position = 1)
    private Boolean includeExtend;

}
