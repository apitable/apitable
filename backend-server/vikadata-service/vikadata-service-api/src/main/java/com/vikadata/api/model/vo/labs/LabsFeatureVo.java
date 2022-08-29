package com.vikadata.api.model.vo.labs;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullArraySerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * <p>
 * 实验性功能列表
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/20 10:48:11
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("实验性功能信息列表")
public class LabsFeatureVo {

    private static final String FEATURES = "[\"RENDER_PROMPT\", \"ASYNC_COMPUTE\", \"ROBOT\"]";

    @ApiModelProperty(value = "实验性功能列表", dataType = "java.util.List", example = FEATURES, position = 1)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> keys;
}
