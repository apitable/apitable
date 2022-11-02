package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@ApiModel("创建表单视图")
@Builder
public class CreateDatasheetVo  {

    @ApiModelProperty(value = "表单ID", example = "dstfCEKoPjXSJ8jdSj", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "所属文件夹ID", example = "fodn173Q0e8nC", position = 2)
    private String folderId;

    @ApiModelProperty(value = "前一个节点ID", example = "dstfCEKoPjXSJ8jdSj", position = 3)
    private String preNodeId;

    @ApiModelProperty(value = "创建时间", example = "24342423342", position = 3)
    private Long createdAt;

    @JsonIgnoreProperties
    private String nodeId;

    @JsonIgnoreProperties
    private String parentId;

}
