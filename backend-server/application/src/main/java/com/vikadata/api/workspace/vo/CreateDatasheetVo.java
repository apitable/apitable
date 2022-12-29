package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@ApiModel("Create DataSheet View")
@Builder
public class CreateDatasheetVo  {

    @ApiModelProperty(value = "DataSheet ID", example = "dstfCEKoPjXSJ8jdSj", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "Folder ID", example = "fodn173Q0e8nC", position = 2)
    private String folderId;

    @ApiModelProperty(value = "Previous node ID", example = "dstfCEKoPjXSJ8jdSj", position = 3)
    private String preNodeId;

    @ApiModelProperty(value = "Create time", example = "24342423342", position = 3)
    private Long createdAt;

    @JsonIgnoreProperties
    private String nodeId;

    @JsonIgnoreProperties
    private String parentId;

}
