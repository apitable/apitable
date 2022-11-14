package com.vikadata.api.organization.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * <p>
 * Edit your own member information request parameters
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Edit your own member information request parameters")
public class UpdateMemberOpRo {

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 3)
    @NotBlank(message = "Cannot be empty")
    @Size(max = 32, message = "The length cannot exceed 32 bits")
    private String memberName;
}
