package com.vikadata.api.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Space Station Data Creator View
 * </p>
 */
@Data
@ApiModel("Data Creator View")
public class CreatedMemberInfoVo {

    @ApiModelProperty(value = "Node Creator - Name", position = 8)
    private String memberName;

    @ApiModelProperty(value = "Node Creator - avatar", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 9)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

}
