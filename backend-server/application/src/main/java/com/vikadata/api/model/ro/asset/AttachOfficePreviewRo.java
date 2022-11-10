package com.vikadata.api.model.ro.asset;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* Attachment preview request parameter ro
* </p>
*/
@Data
@ApiModel("Attachment preview request parameter ro")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AttachOfficePreviewRo {

    /**
     * Cloud file storage path
     */
    @NotBlank(message = "Cloud file storage path")
    @ApiModelProperty(value = "Cloud file name/key", example = "space/2020/03/27/1243592950910349313", position = 1)
    private String token;


    @NotBlank(message = "Source file name and suffix of cloud files")
    @ApiModelProperty(value = "Source file name and suffix of cloud files", example = "Leida Team Books.xls", position = 2)
    private String attname;

}
