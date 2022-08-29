package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Vika Bundle 请求参数
 * </p>
 *
 * @author Chambers
 * @date 2020/5/6
 */
@Data
@ApiModel("Vika Bundle 请求参数")
public class VikaBundleOpRo {

    @ApiModelProperty(value = "上传文件", position = 1, required = true)
    @NotNull(message = "文件不能为空")
    private MultipartFile file;

    @ApiModelProperty(value = "父类节点ID", example = "fodSf4PZBNwut", position = 2)
    private String parentId;

    @ApiModelProperty(value = "前置节点ID", example = "nod10", position = 3)
    private String preNodeId;

    @ApiModelProperty(value = "密码", example = "***", position = 4)
    private String password;
}
