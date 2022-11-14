package com.vikadata.api.base.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Resource upload completion notification RO
 */
@Data
@ApiModel("Resource upload completion notification RO")
public class AssetUploadNotifyRO {

    @ApiModelProperty(value = "Type (0: user avatar; 1: space logo; 2: number table attachment; 3: cover image; 4: node description)", example = "0", position = 1, required = true)
    @NotNull(message = "Type cannot be null")
    private Integer type;

    @ApiModelProperty(value = "资源名列表", example = "[\"spc10/2019/12/10/159\", \"spc10/2019/12/10/168\"]", position = 2)
    private List<String> resourceKeys;

}
