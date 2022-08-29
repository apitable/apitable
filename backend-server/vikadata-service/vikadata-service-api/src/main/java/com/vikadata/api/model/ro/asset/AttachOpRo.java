package com.vikadata.api.model.ro.asset;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * 附件请求参数
 * </p>
 *
 * @author Chambers
 * @date 2019/12/30
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("附件请求参数")
public class AttachOpRo {

	@ApiModelProperty(value = "上传文件", position = 1, required = true)
	@NotNull(message = "文件不能为空")
	private MultipartFile file;

	@ApiModelProperty(value = "类型(0:用户头像;1:空间logo;2:数表附件;3:封面图;4:节点描述)", example = "0", position = 2, required = true)
	@NotNull(message = "类型不能为空")
	private Integer type;

	@ApiModelProperty(value = "节点Id（数表附件、封面图和节点描述须传）", example = "dst10", position = 4)
	private String nodeId;

    @ApiModelProperty(value = "密码登录人机验证，前端获取getNVCVal函数的值（未登录状态下会进行人机验证）", example = "FutureIsComing", position = 4)
    private String data;
}
