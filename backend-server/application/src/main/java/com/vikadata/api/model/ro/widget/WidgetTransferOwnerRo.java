package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget handover owner request parameters
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("Widget handover owner request parameters")
public class WidgetTransferOwnerRo {

    @NotBlank
    @ApiModelProperty(value = "Widget Id", position = 1)
    private String packageId;

    @NotNull(message = "New handover member ID cannot be empty")
    @ApiModelProperty(value = "Handover Member Id", position = 2)
    private Long transferMemberId;

}
