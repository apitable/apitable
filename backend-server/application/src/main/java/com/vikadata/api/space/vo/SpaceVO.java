package com.vikadata.api.space.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * Space View
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Space List View")
public class SpaceVO {

    @ApiModelProperty(value = "Space ID", example = "spc10", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "Name", example = "This is a space", position = 2)
    private String name;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Icon", example = "https://...", position = 3)
    private String logo;

    @ApiModelProperty(value = "Whether there are red dots", example = "false", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean point;

    @ApiModelProperty(value = "Whether it is the main administrator of the space", example = "false", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean admin;

    @ApiModelProperty(value = "Whether it is a paid space", example = "false", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean charge;

    @ApiModelProperty(value = "Whether it is in pre deletion status", example = "false", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean preDeleted;

    @ApiModelProperty(value = "Maximum total number of subscription plan members", position = 8)
    private Long maxSeat;

    @ApiModelProperty(value = "Space domain name", position = 9)
    private String spaceDomain;

    @Deprecated
    @ApiModelProperty(value = "Third party integration binding information", position = 10)
    private SpaceSocialConfig social;
}
