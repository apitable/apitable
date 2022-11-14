package com.vikadata.api.enterprise.widget.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget audit submit parameter
 * </p>
 */
@Data
@ApiModel("Widget audit submit parameter")
public class WidgetAuditSubmitDataRo {

    @NotBlank
    @ApiModelProperty(value = "Widget Id", position = 1)
    private String globalPackageId;

    @NotBlank
    @ApiModelProperty(value = "Submit version", position = 2)
    private String submitVersion;

    @NotNull
    @ApiModelProperty(value = "Audit result", position = 3)
    private Boolean auditResult;

    @ApiModelProperty(value = "Review remarks", position = 4)
    private String auditRemark;

    @NotEmpty
    @ApiModelProperty(required = true)
    private String dstId;

    @NotEmpty
    @ApiModelProperty(required = true)
    private String fieldId;

    @NotEmpty
    @ApiModelProperty(required = true)
    private String recordId;

}
