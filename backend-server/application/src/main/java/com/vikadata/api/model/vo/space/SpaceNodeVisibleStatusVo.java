package com.vikadata.api.model.vo.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Working directory setting information view of a space
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ApiModel("Working directory setting information view of a space")
public class SpaceNodeVisibleStatusVo {

	@ApiModelProperty(value = "Space ID", example = "spc10", position = 1)
	private boolean visibleStatus;
}
