package com.vikadata.api.model.ro.asset;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

/**
 * <p>
 * 附件URL请求参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/25
 */
@Data
@ApiModel("附件请求参数")
public class AttachUrlOpRo {

	@ApiModelProperty(value = "上传文件的URL", position = 1, required = true)
	@NotNull(message = "文件URL不能为空")
	private String url;

	@ApiModelProperty(value = "类型(0:用户头像/1:空间logo/2:数表附件)", example = "0", position = 2, required = true)
	@NotNull(message = "类型不能为空")
	@Max(value = 2, message = "类型错误")
	private Integer type;

	@ApiModelProperty(value = "数表节点Id（数表附件须传）", example = "dst10", position = 4)
	private String nodeId;
}
