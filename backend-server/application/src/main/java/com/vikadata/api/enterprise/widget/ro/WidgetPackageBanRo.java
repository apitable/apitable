package com.vikadata.api.enterprise.widget.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Blocking of widget/Unsealing request parameters
 * </p>
 */
@Data
@ApiModel("Blocking of widget/Unsealing request parameters")
public class WidgetPackageBanRo {

    @ApiModelProperty(value = "Widget Package ID", example = "wpkAAA", position = 1)
    @NotBlank(message = "Package Id cannot be empty")
    private String packageId;

    @ApiModelProperty(value = "Blocking: false, unblocking: true", example = "false", position = 2)
    @NotNull(message = "The operation status cannot be empty")
    private Boolean unban;

}
