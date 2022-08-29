package com.vikadata.api.modular.internal.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * <p>
 * 空间订阅计划资源视图
 * 提供于中间层调用
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/14 14:49
 */
@Data
@ApiModel("空间订阅计划资源视图")
public class InternalSpaceApiUsageVo {

    @ApiModelProperty(value = "是否允许超量限制", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAllowOverLimit;

    @ApiModelProperty(value = "已使用的API用量数", example = "10000", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiUsageUsedCount;

    @ApiModelProperty(value = "最大使用API用量数", example = "60000", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxApiUsageCount;
}
