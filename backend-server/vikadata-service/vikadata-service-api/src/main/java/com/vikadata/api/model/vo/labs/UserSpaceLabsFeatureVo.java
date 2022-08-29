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
 * 用户以及所在空间站的所有实验性功能状态值对象
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/26 16:28:29
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("用户空间站所有可用实验室功能状态值对象")
public class UserSpaceLabsFeatureVo {

    @ApiModelProperty(value = "所有可用实验室功能的状态集", position = 1)
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private Map<String, List<FeatureVo>> features;

}
