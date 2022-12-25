/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.space.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

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
	@ApiModelProperty(value = "Head portrait address", example = "http://wwww.apitable.com/2019/11/12/17123187253.png", position = 2)
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

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 7)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San", position = 8)
    private String nickName;

}
