package com.vikadata.api.model.ro.organization;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 *     Remove role members request parameter
 * </p>
 * @author tao
 */
@Data
@ApiModel("Remove role members request")
public class DeleteRoleMemberRo {

    @NotEmpty
    @ApiModelProperty(value = "role member's unit id", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

}
