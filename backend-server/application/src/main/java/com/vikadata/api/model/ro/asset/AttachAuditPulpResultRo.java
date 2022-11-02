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
public class AttachAuditPulpResultRo {

	@ApiModelProperty(value = "suggestion是各种审核类型的对应的管控建议，取值包括：[“block”,”review”,”pass”]", position = 1, required = true)
	@NotNull(message = "suggestion是各种审核类型的对应的管控建议，取值包括：[“block”,”review”,”pass”]")
	private String suggestion;

	private AttachAuditResultRo result;

}
