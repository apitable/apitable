package com.vikadata.api.model.ro.node;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 节点请求参数
 *
 * @author Troy
 * @since 2022/03/29
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("节点请求参数")
public class CreateDatasheetRo {

    @ApiModelProperty(value = "名称", example = "这是一个节点", position = 1, required = true)
    @Size(max = 100, message = "名称长度不能超过100位")
    private String name;

    @ApiModelProperty(value = "父类节点Id", example = "nod10", position = 2)
    @NotBlank(message = "父类节点Id不能为空")
    private String folderId;

    @ApiModelProperty(value = "目标位置的前一个节点，为空时即移动到了首位", example = "nod10", position = 3)
    private String preNodeId;

    @ApiModelProperty(value = "描述", example = "这是个表格", position = 4)
    private String description;

    public NodeOpRo tranferToNodeOpRo() {
        return NodeOpRo.builder()
                .nodeName(this.name)
                .type(2)
                .parentId(this.folderId)
                .preNodeId(this.preNodeId)
                .build();
    }

    public boolean needToInsertDesc() {
        return StrUtil.isNotBlank(this.description);
    }

}
