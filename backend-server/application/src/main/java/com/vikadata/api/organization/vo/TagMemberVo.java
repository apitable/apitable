package com.vikadata.api.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Member list view of the tag
 * </p>
 */
@Data
@ApiModel("Member list view of the tag")
public class TagMemberVo {

    @ApiModelProperty(value = "Member ID", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 2)
    private String memberName;

    @ApiModelProperty(value = "Job No", example = "000101", position = 3)
    private String jobNumber;

    @ApiModelProperty(value = "Phone number", example = "13610102020", position = 4)
    private String mobile;

    @ApiModelProperty(value = "Email", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "Department", example = "Design Department, Test Department and Development Department", position = 6)
    private String depts;
}
