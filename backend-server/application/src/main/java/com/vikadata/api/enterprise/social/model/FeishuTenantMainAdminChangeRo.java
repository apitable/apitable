package com.vikadata.api.enterprise.social.model;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Request parameters of space replacement master administrator
 * </p>
 */
@Data
@ApiModel("Lark tenant space change master administrator request parameters")
public class FeishuTenantMainAdminChangeRo {

    @ApiModelProperty(value = "Tenant ID", example = "128371293xja", required = true)
    @NotBlank(message = "Tenant ID")
    private String tenantKey;

    @ApiModelProperty(value = "Space identification", example = "spc2123hjhasd", required = true)
    @NotBlank(message = "Space ID cannot be empty")
    private String spaceId;

    @ApiModelProperty(value = "Member ID of the new master administrator", example = "123456", position = 2, required = true)
    @NotNull(message = "The member ID of the new master administrator cannot be empty")
    private Long memberId;
}
