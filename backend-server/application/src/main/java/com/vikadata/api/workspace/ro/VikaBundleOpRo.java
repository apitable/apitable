package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Vika Bundle request parameters
 * </p>
 */
@Data
@ApiModel("Vika Bundle request parameters")
public class VikaBundleOpRo {

    @ApiModelProperty(value = "Upload files", position = 1, required = true)
    @NotNull(message = "File cannot be empty")
    private MultipartFile file;

    @ApiModelProperty(value = "Parent class node ID", example = "fodSf4PZBNwut", position = 2)
    private String parentId;

    @ApiModelProperty(value = "Predecessor node ID", example = "nod10", position = 3)
    private String preNodeId;

    @ApiModelProperty(value = "Password", example = "***", position = 4)
    private String password;
}
