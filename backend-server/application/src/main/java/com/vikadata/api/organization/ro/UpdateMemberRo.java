package com.vikadata.api.organization.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <p>
 * Edit member information request parameters
 * </p>
 */
@Data
@ApiModel("Edit member information request parameters")
public class UpdateMemberRo {

	@NotNull
	@ApiModelProperty(value = "Member ID", required = true, dataType = "java.lang.String", example = "1", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long memberId;

	@ApiModelProperty(value = "Member Name", example = "Zhang San", position = 3)
    @Size(max = 32, message = "The length cannot exceed 32 bits")
	private String memberName;

	@ApiModelProperty(value = "Position", example = "Manager", position = 4)
	private String position;

	@ApiModelProperty(value = "email", example = "example@qq.com", position = 5)
	private String email;

	@Size(max = 60, message = "The job number cannot be more than 60 characters")
	@ApiModelProperty(value = "Job No", example = "\"143613308\"", position = 6)
	private String jobNumber;

	@ApiModelProperty(value = "Department ID", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 7)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> teamIds;

	@ApiModelProperty(value = "Attribution tag ID set", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 8)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> tagIds;
}
