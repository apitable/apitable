package com.vikadata.api.model.ro.organization;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 *      role member unit request parameter
 * </p>
 */
@Data
@ApiModel("role member unit request parameter")
public class RoleMemberUnitRo {

    @ApiModelProperty(value = "ID", dataType = "java.lang.String", required = true, example = "120322719823", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long id;

    @NotNull
    @ApiModelProperty(value = "unit type，1 = team，3 = member", required = true, example = "1", position = 2)
    private Integer type;
}
