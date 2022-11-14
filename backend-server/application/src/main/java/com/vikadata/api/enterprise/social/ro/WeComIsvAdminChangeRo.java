package com.vikadata.api.enterprise.social.ro;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
 * Tenant space replacement master administrator
 * </p>
 */
@ApiModel("Tenant space replacement master administrator")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvAdminChangeRo {

    @ApiModelProperty(value = "application package  ID", required = true)
    @NotNull
    private String suiteId;

    @ApiModelProperty(value = "Authorized enterprises ID", required = true)
    @NotNull
    private String authCorpId;

    @ApiModelProperty(value = "Space ID", required = true)
    @NotBlank
    private String spaceId;

    @ApiModelProperty(value = "Members of the new master administrator ID", required = true)
    @NotNull
    private Long memberId;

}
