package com.vikadata.api.modular.social.model;

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
@ApiModel("DingTalk Tenant Space Change Primary Administrator Request Parameters")
public class DingTalkTenantMainAdminChangeRo {

    @ApiModelProperty(value = "Space identification", example = "spc2123hjhasd", required = true)
    @NotBlank(message = "Space ID cannot be empty")
    private String spaceId;

    @ApiModelProperty(value = "MemberID of the new master administrator", example = "123456", position = 2, required = true)
    @NotNull(message = "The member ID of the new master administrator cannot be empty")
    private Long memberId;

    @ApiModelProperty(value = "Third party organization ID", example = "ddsddd", position = 3, required = true)
    @NotNull(message = "Third party organization ID cannot be empty")
    private String corpId;
}
