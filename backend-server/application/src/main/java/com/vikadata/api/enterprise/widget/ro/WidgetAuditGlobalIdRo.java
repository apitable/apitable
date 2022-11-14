package com.vikadata.api.enterprise.widget.ro;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget Audit Global ID Request Parameters
 * </p>
 */
@Data
@ApiModel("Widget Audit Global ID Request Parameters")
public class WidgetAuditGlobalIdRo {

    @NotBlank
    @ApiModelProperty(value = "Widget applet name", position = 1)
    private String auditWidgetName;

    @NotNull
    @ApiModelProperty(value = "Audit result", position = 2)
    private Boolean auditResult;

    @ApiModelProperty(value = "Review remarks", position = 3)
    private String auditRemark;

    @NotBlank
    @Email(message = "notice email format error")
    @ApiModelProperty(value = "Notification Email", position = 4)
    private String noticeEmail;

    @NotNull
    @ApiModelProperty(value = "Package Type(0:Third party,1:Official)", position = 5)
    private Integer packageType;

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
