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
public class AttachAuditScenesRo {

	@ApiModelProperty(value = "图片敏感人物审核结果", position = 1, required = true)
	@NotNull(message = "图片鉴黄结果")
	private String politician;

	@ApiModelProperty(value = "图片鉴黄审核结果", position = 2, required = true)
	@NotNull(message = "图片鉴黄结果")
	private AttachAuditPulpResultRo pulp;


	@ApiModelProperty(value = "图片暴恐审核结果", position = 3, required = true)
	@NotNull(message = "图片暴恐审核结果")
	private String terror;
}
