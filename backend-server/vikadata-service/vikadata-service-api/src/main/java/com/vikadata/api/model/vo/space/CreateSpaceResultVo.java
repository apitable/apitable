package com.vikadata.api.model.vo.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间vo
 * </p>
 *
 * @author Chambers
 * @date 2019/11/14
 */
@Data
@ApiModel("空间vo")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class CreateSpaceResultVo {

	@ApiModelProperty(value = "空间ID", example = "spc10", position = 1)
	private String spaceId;
}
