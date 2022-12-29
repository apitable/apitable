package com.vikadata.api.space.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.NullArraySerializer;

/**
 * <p>
 * List of experimental functions
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("List of experimental function information")
public class LabsFeatureVo {

    private static final String FEATURES = "[\"RENDER_PROMPT\", \"ASYNC_COMPUTE\", \"ROBOT\"]";

    @ApiModelProperty(value = "List of experimental functions", dataType = "java.util.List", example = FEATURES, position = 1)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> keys;
}
