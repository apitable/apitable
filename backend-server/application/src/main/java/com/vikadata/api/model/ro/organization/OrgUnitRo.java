package com.vikadata.api.model.ro.organization;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Org Unit Request Parameters
 * </p>
 */
@Data
@ApiModel("Org Unit Request Parameters")
public class OrgUnitRo {

    @ApiModelProperty(value = "ID", dataType = "java.lang.String", required = true, example = "120322719823", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long id;

    @NotNull
    @ApiModelProperty(value = "Classification, only the specified type can be received, 1=department, 2=member", required = true, example = "1", position = 2)
    private Integer type;
}
