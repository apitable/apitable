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
@ApiModel("导入数表请求参数")
public class ImportExcelOpRo {

    @ApiModelProperty(value = "父节点Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "父节点Id不能为空")
    private String parentId;

    @ApiModelProperty(value = "导入文件", position = 3, required = true)
    @NotNull(message = "导入文件不能为空")
    private MultipartFile file;
}
