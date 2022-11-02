package com.vikadata.api.model.ro.node;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.util.VikaStrings;
import com.vikadata.api.enums.node.NodeType;

/**
 * 节点请求参数
 *
 * @author Chambers
 * @since 2019/10/8
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("节点请求参数")
public class NodeOpRo {

    @ApiModelProperty(value = "父类节点Id", example = "nod10", position = 2, required = true)
    @NotBlank(message = "父类节点Id不能为空")
    private String parentId;

    @ApiModelProperty(value = "名称", example = "这是一个节点", position = 3)
    @Size(max = 100, message = "名称长度不能超过100位")
    private String nodeName;

    @ApiModelProperty(value = "类型.1:文件夹;2:数表;3:收集表;4:仪表盘;5:镜像", example = "1", position = 4, required = true)
    @NotNull(message = "类型不能为空")
    @Min(value = 1, message = "类型错误")
    @Max(value = 5, message = "类型错误")
    private Integer type;

    @ApiModelProperty(value = "目标位置的前一个节点，为空时即移动到了首位", example = "nod10", position = 5)
    private String preNodeId;

    @ApiModelProperty(value = "其他信息", position = 6)
    private NodeRelRo extra;

    public String getNodeName() {
        if (StrUtil.isNotBlank(nodeName)) {
            return nodeName;
        }
        NodeType nodeType = NodeType.toEnum(type);
        switch (nodeType) {
            case FOLDER:
            case DATASHEET:
            case FORM: // 神奇表单名称是有前端传过来的
            case DASHBOARD:
            case MIRROR: // 镜像名称是有前端传过来的
                // default_create_'key' 配置在strings表
                return VikaStrings.t("default_create_" + nodeType.name().toLowerCase());
            default:
                return VikaStrings.t("default_create_file");
        }
    }
}
