package com.vikadata.api.model.ro.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <p>
 * Remove tag member request parameters
 * </p>
 */
@Data
@ApiModel("Remove tag member request parameters")
public class DeleteTagMemberRo {

    @NotNull
    @ApiModelProperty(value = "Member ID", example = "1", required = true, position = 2)
    private Long tagId;

    @NotEmpty
    @Size(max = 100)
    @ApiModelProperty(value = "Member ID Collection", dataType = "List", example = "[1,2,3,4]", required = true, position = 3)
    private List<Long> memberId;
}
