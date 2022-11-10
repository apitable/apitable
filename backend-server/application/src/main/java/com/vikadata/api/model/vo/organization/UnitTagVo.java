package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Label Unit View
 * </p>
 */
@Data
@ApiModel("Label Unit View")
public class UnitTagVo {

	@ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long unitId;

	@ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 2)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long tagId;

	@ApiModelProperty(value = "Department name", example = "R&D Department ｜ Zhang San", position = 3)
	private String tagName;

	@ApiModelProperty(value = "Department abbreviation", example = "RESEARCH AND DEVELOPMENT", position = 4)
	private String shortName;

	@ApiModelProperty(value = "Number of members", example = "3", position = 5)
	private Integer memberCount;
}
