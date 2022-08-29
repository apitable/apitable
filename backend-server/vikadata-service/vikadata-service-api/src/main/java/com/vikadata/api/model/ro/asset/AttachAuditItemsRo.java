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
public class AttachAuditItemsRo {


	@ApiModelProperty(value = "处理文件结果的操作指令", position = 1, required = true)
	@NotNull(message = "处理文件结果的操作指令")
	private String cmd;

	@ApiModelProperty(value = "处理文件结果的操作状态码", position = 2, required = true)
	@NotNull(message = "处理文件结果的操作状态码")
	private String code;

	@ApiModelProperty(value = "处理文件结果的操作描述", position = 2, required = true)
	@NotNull(message = "处理文件结果的操作描述")
	private String desc;

	@ApiModelProperty(value = "处理文件的结果", position = 3, required = true)
	@NotNull(message = "处理文件的结果")
	private AttachAuditResultDisableRo result;


}
