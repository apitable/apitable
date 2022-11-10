package com.vikadata.api.model.vo.labs;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullObjectSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * Users and all experimental functional status value objects of the space station
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("All available laboratory function status value objects of user space station")
public class UserSpaceLabsFeatureVo {

    @ApiModelProperty(value = "State set of all available lab functions", position = 1)
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private Map<String, List<FeatureVo>> features;

}
