package com.vikadata.api.model.vo.wechat;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* 小程序码vo
* </p>
*
* @author Chambers
* @date 2020/2/21
*/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("小程序码vo")
public class MaCodeVo {

	@ApiModelProperty(value = "唯一标识", example = "fa23r2thu", position = 1)
	private String mark;

	@ApiModelProperty(value = "小程序码的base64编码", example = "124bi132", position = 2)
	private String encode;
}
