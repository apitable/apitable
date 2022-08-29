package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * <p>
 * 修改节点角色请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/20 13:59
 */
@Data
@ApiModel("修改节点角色请求参数")
public class UpdateRoleRo {

    @NotBlank(message = "节点ID不能为空")
    @ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "节点角色继承上级模式，为false时，需要传递roles参数", example = "false", position = 2)
    private Boolean extend;

    private List<NodeRoleRo> roles;
}
