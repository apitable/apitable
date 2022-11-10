package com.vikadata.api.model.vo.template;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Albums View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Template Center - Albums View")
public class AlbumVo {

    @ApiModelProperty(value = "Albums ID", example = "albxx", position = 1)
    private String albumId;

    @ApiModelProperty(value = "Albums Name", example = "Metaverse", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String name;

    @ApiModelProperty(value = "Albums Cover", example = "https://xxx.com/cover001.jpg", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "Albums Description", example = "This is a description about album.", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String description;
}
