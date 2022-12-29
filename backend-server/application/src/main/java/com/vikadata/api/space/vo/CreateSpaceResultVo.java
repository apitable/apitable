package com.vikadata.api.space.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Space vo
 * </p>
 */
@Data
@ApiModel("Space vo")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class CreateSpaceResultVo {

	@ApiModelProperty(value = "Space ID", example = "spc10", position = 1)
	private String spaceId;
}
