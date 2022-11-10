package com.vikadata.api.model.vo.template;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Recommend Custom Albums Group View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Recommend Custom Albums Group View")
public class AlbumGroupVo {

    @ApiModelProperty(value = "Albums Group Name", example = "Other Users Also Like", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String name;

    @ApiModelProperty(value = "Albums View List", position = 2)
    private List<AlbumVo> albums;
}
