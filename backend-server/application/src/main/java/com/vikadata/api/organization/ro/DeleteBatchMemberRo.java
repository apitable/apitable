package com.vikadata.api.organization.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * <p>
 * Delete Member Request Parameter
 * </p>
 */
@Data
@ApiModel("Batch Delete Member Request Parameters")
public class DeleteBatchMemberRo {

    @ApiModelProperty(value = "Delete action (0: delete this department, 1: delete from the organization structure completely)", example = "0", position = 1)
    private int action;

    @NotEmpty
    @ApiModelProperty(value = "Member ID Collection", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberId;

    @ApiModelProperty(value = "Department ID, if it is the root department, can not be transferred. It is deleted from the root door by default, consistent with the principle of removing members from the space", dataType = "java.lang.String", example = "1", required = true, position = 3)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;
}
