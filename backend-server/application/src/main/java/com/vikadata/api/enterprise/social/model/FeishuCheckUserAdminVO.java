package com.vikadata.api.enterprise.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Verify whether Lark login user is an administrator
 */
@Data
@ApiModel("Verify whether Lark login user is an administrator")
public class FeishuCheckUserAdminVO {

    @ApiModelProperty(value = "Administrator or not", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;
}
