package com.vikadata.api.asset.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("Attachment manual review results")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetsAuditOpRo {

    @NotBlank
    @ApiModelProperty(value = "storage path", example = "space/2020/03/27/1243592950910349313", position = 1)
    private String assetFileUrl;

    @NotBlank
    @ApiModelProperty(value = "Review results recommendations", example = "block", position = 2)
    private String auditResultSuggestion;
}
