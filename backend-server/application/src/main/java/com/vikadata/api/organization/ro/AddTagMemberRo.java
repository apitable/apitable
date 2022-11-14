package com.vikadata.api.organization.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Add tag member request parameter
 * </p>
 */
@Data
@ApiModel("Add tag member request parameter")
public class AddTagMemberRo {

    @ApiModelProperty(value = "Tag ID", dataType = "long", example = "12032", position = 1)
    private Long tagId;

    @ApiModelProperty(value = "Member ID List", dataType = "List", example = "[1,2,3,4]", position = 2)
    private List<Long> memberIds;
}
