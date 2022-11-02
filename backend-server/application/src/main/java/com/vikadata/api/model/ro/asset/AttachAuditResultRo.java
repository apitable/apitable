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
public class AttachAuditResultRo {

	@ApiModelProperty(value = "图片所属的标签，一张图片只会有一个标签", position = 1, required = true)
	@NotNull(message = "图片所属的标签，一张图片只会有一个标签")
	private String label;

	@ApiModelProperty(value = "图片所属标签的置信度", position = 2, required = true)
	@NotNull(message = "图片所属标签的置信度")
	private float score;

}
