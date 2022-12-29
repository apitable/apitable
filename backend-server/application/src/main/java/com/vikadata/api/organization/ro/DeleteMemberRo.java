package com.vikadata.api.organization.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Delete Member Request Parameter
 * </p>
 */
@Data
@ApiModel("Delete Member Request Parameter")
public class DeleteMemberRo {

    @ApiModelProperty(value = "Delete action (0: delete this department, 1: delete from the organization structure completely)", example = "0", position = 1)
    private int action;

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Department ID, if it is the root department, can not be transferred. It is deleted from the root door by default, consistent with the principle of removing members from the space", dataType = "java.lang.String", example = "1", required = true, position = 3)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;
}
