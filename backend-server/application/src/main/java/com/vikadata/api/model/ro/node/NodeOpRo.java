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
 * Node Request Parameters
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Node Request Parameters")
public class NodeOpRo {

    @ApiModelProperty(value = "Parent Node Id", example = "nod10", position = 2, required = true)
    @NotBlank(message = "The parent node ID cannot be empty")
    private String parentId;

    @ApiModelProperty(value = "Name", example = "This is a node", position = 3)
    @Size(max = 100, message = "The name length cannot exceed 100 bits")
    private String nodeName;

    @ApiModelProperty(value = "Type. 1: folder; 2: DataSheet; 3: Form; 4: Dashboard; 5: Mirror", example = "1", position = 4, required = true)
    @NotNull(message = "Type cannot be empty")
    @Min(value = 1, message = "Error in type")
    @Max(value = 5, message = "Error in type")
    private Integer type;

    @ApiModelProperty(value = "The previous node of the target position moves to the first position when it is empty", example = "nod10", position = 5)
    private String preNodeId;

    @ApiModelProperty(value = "Other information", position = 6)
    private NodeRelRo extra;

    public String getNodeName() {
        if (StrUtil.isNotBlank(nodeName)) {
            return nodeName;
        }
        NodeType nodeType = NodeType.toEnum(type);
        switch (nodeType) {
            case FOLDER:
            case DATASHEET:
            case FORM: // The name of the magic form is transmitted from the front end
            case DASHBOARD:
            case MIRROR: // The image name is transmitted from the front end
                // default_create_'key' Configure in the strings table
                return VikaStrings.t("default_create_" + nodeType.name().toLowerCase());
            default:
                return VikaStrings.t("default_create_file");
        }
    }
}
