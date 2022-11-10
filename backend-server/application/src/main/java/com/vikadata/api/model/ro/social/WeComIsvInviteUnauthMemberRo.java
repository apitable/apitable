package com.vikadata.api.model.ro.social;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * Invite unauthorized users
 * </p>
 */
@ApiModel("Invite unauthorized users")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvInviteUnauthMemberRo {

    @ApiModelProperty(value = "Space ID", required = true)
    @NotBlank
    private String spaceId;

    @ApiModelProperty(value = "Select Invited Member Ticket List", required = true)
    @NotEmpty
    private List<String> selectedTickets;

}
