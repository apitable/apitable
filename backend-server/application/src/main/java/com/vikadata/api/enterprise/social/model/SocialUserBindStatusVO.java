package com.vikadata.api.enterprise.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Binding status of third-party users
 */
@Data
@ApiModel("Binding status of third-party users")
public class SocialUserBindStatusVO {

    @ApiModelProperty(value = "State", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean status;
}
