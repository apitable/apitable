package com.vikadata.api.space.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Primary administrator information vo
 * </p>
 */
@Data
@ApiModel("Primary administrator information vo")
public class MainAdminInfoVo {

	@ApiModelProperty(value = "Name", example = "Zhang San", position = 1)
	private String name;

	@JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
	@ApiModelProperty(value = "Head portrait address", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
	private String avatar;

	@ApiModelProperty(value = "Position", example = "Manager", position = 3)
	private String position;

    @ApiModelProperty(value = "Mobile phone area code", example = "+1", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String areaCode;

	@ApiModelProperty(value = "Phone number", example = "13610102020", position = 4)
	private String mobile;

	@ApiModelProperty(value = "Email", example = "example@qq.com", position = 5)
	private String email;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 6)
    private Boolean isMemberNameModified;

}
