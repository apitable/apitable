package com.vikadata.api.model.vo.node;

import java.util.Map;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 字段权限视图
 * </p>
 *
 * @author Chambers
 * @date 2021/4/28
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("字段权限视图")
public class FieldPermissionView {

    @ApiModelProperty(value = "节点ID", example = "dstGxznHFXf9pvF1LZ")
    private String nodeId;

    @ApiModelProperty(value = "数表ID（节点ID / 源数表节点ID）", example = "dstGxznHFXf9pvF1LZ", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "数表字段权限信息", dataType = "java.util.Map", position = 2)
    private Map<String, FieldPermissionInfo> fieldPermissionMap;
}
