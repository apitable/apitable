package com.vikadata.api.enterprise.wechat.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* Applet code vo
* </p>
*/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Applet code vo")
public class MaCodeVo {

	@ApiModelProperty(value = "Unique identification", example = "fa23r2thu", position = 1)
	private String mark;

	@ApiModelProperty(value = "Base 64 encoding of small program code", example = "124bi132", position = 2)
	private String encode;
}
