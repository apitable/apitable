package com.vikadata.api.model.vo.marketplace;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 * Application Market - Space Station Application View
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Third party platform integration - space station application view")
public class MarketplaceSpaceAppVo {

    @ApiModelProperty(value = "App ID", example = "app112", position = 1)
    private String appId;

    @ApiModelProperty(value = "Whether this space station has been opened (0: No, 1: Yes)", example = "0", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean status;

}
