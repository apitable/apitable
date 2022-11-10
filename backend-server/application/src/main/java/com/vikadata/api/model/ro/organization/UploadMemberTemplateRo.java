package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Upload Employee Template Request Parameters
 * </p>
 */
@Data
@ApiModel("Upload Employee Template Request Parameters")
public class UploadMemberTemplateRo {

    @NotNull(message = "The import file cannot be empty")
    @ApiModelProperty(value = "Import File", position = 2, required = true)
    private MultipartFile file;

    @ApiModelProperty(value = "Password login for human-machine verification, and the front end obtains the value of get NVC Val function (human-machine verification will be performed when not logged in)", example = "FutureIsComing", position = 3)
    private String data;
}
