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
public class AttachAuditScenesResultRo {

	@ApiModelProperty(value = "状态码0成功，1等待处理，2正在处理，3处理失败，4通知提交失败。", position = 3, required = true)
	@NotNull(message = "处理队列名")
	private String code;

	@ApiModelProperty(value = "消息结果", position = 2, required = true)
	@NotNull(message = "消息结果")
	private String message;

	@ApiModelProperty(value = "状态码0成功，1等待处理，2正在处理，3处理失败，4通知提交失败。", position = 3, required = true)
	@NotNull(message = "处理队列名")
	private AttachAuditScenesRo scenes;

	@ApiModelProperty(value = "处理队列名", position = 2, required = true)
	@NotNull(message = "处理队列名")
	private String suggestion;

}
