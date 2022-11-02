package com.vikadata.api.model.ro.asset;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 图片审核结果请求参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/21
 */
@Data
@ApiModel("图片审核结果请求参数")
public class AttachAuditResultDisableRo {

	@ApiModelProperty(value = "文件是否被禁用的标识，true表示文件已被禁用，false表示文件没有被禁用。(需在增量审核配置，开启【自动禁用】功能)", position = 1, required = true)
	@NotNull(message = "文件是否被禁用的标识")
	private boolean disable;

	private AttachAuditScenesResultRo result;

}
