package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 小程序审核submit参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序审核submit参数")
public class WidgetAuditSubmitDataRo {

    @NotBlank
    @ApiModelProperty(value = "小程序Id", position = 1)
    private String globalPackageId;

    @NotBlank
    @ApiModelProperty(value = "submit版本", position = 2)
    private String submitVersion;

    @NotNull
    @ApiModelProperty(value = "审核结果", position = 3)
    private Boolean auditResult;

    @ApiModelProperty(value = "审核备注", position = 4)
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
