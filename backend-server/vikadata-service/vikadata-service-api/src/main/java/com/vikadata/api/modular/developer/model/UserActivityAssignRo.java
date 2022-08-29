package com.vikadata.api.modular.developer.model;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * 指定用户活动状态的请求参数
 * </p>
 *
 * @author Chambers
 * @date 2021/9/22
 */
@Data
@ApiModel("指定用户活动状态的请求参数")
public class UserActivityAssignRo {

    @ApiModelProperty(value = "引导ID", example = "7", position = 1)
    private Integer wizardId;

    @ApiModelProperty(value = "指定引导ID 的赋值", example = "7", position = 2)
    private Integer value;

    @ApiModelProperty(value = "指定用户ID 列表（同测试手机号二选一）", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 3)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> userIds;

    @ApiModelProperty(value = "测试帐号手机号", example = "1340000", position = 4)
    private String testMobile;
}
