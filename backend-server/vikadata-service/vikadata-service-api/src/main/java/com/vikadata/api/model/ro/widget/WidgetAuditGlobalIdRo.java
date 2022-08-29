package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序审核全局ID请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序审核全局ID请求参数")
public class WidgetAuditGlobalIdRo {

    @NotBlank
    @ApiModelProperty(value = "审核小程序名称", position = 1)
    private String auditWidgetName;

    @NotNull
    @ApiModelProperty(value = "审核结果", position = 2)
    private Boolean auditResult;

    @ApiModelProperty(value = "审核备注", position = 3)
    private String auditRemark;

    @NotBlank
    @Email(message = "notice email format error")
    @ApiModelProperty(value = "通知邮件", position = 4)
    private String noticeEmail;

    @NotNull
    @ApiModelProperty(value = "组件包类型(0:第三方,1:官方)", position = 5)
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
