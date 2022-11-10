package com.vikadata.api.model.vo.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Digital Meter View
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Data table page")
public class DatasheetListVo {

    @ApiModelProperty(value = "Meter ID", position = 2)
    private String id;

    @ApiModelProperty(value = "Name", position = 3)
    private String name;

    @ApiModelProperty(value = "Type 0 - No type 1 - Number table", position = 4)
    private Integer type;

    @ApiModelProperty(value = "Space id", position = 5)
    private String spaceId;

    @ApiModelProperty(value = "Owner userid", position = 6)
    private String ownerId;

    @ApiModelProperty(value = "Creator userid", position = 7)
    private String creatorId;

    @ApiModelProperty(value = "Sort", position = 8)
    private Integer sequence;

    @ApiModelProperty(value = "Version No", position = 9)
    private Long revision;
}
