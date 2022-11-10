package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * ImportExcelOpRo
 *
 * @author Chambers
 * @since 2019/11/6
 */
@Data
@ApiModel("Import data table request parameters")
public class ImportExcelOpRo {

    @ApiModelProperty(value = "Parent Node Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "The parent node ID cannot be empty")
    private String parentId;

    @ApiModelProperty(value = "Import File", position = 3, required = true)
    @NotNull(message = "The import file cannot be empty")
    private MultipartFile file;
}
