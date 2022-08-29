package com.vikadata.api.modular.internal.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * <p>
 * 空间的附件容量信息视图
 * </p>
 *
 * @author Chambers
 * @date 2020/9/12
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("空间的附件容量信息视图")
public class InternalSpaceCapacityVo {

    @ApiModelProperty(value = "是否允许超量限制", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAllowOverLimit;

    @ApiModelProperty(value = "已用容量(单位：byte)", dataType = "java.lang.String", example = "1024", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long usedCapacity;

    @ApiModelProperty(value = "总容量(单位：byte)", dataType = "java.lang.String", example = "1024", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long totalCapacity;

    @ApiModelProperty(value = "当前套餐容量(单位：byte)", dataType = "java.lang.String", example = "1024", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long currentBundleCapacity;

    @ApiModelProperty(value = "赠送的未过期容量(单位：byte)", dataType = "java.lang.String", example = "1024", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long unExpireGiftCapacity;
}
