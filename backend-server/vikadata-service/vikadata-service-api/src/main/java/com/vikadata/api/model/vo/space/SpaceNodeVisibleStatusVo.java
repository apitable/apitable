package com.vikadata.api.model.vo.space;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间的工作目录设置信息视图
 * </p>
 *
 * @author Chambers
 * @date 2019/11/14
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ApiModel("空间的工作目录设置信息视图")
public class SpaceNodeVisibleStatusVo {

	@ApiModelProperty(value = "空间ID", example = "spc10", position = 1)
	private boolean visibleStatus;
}
