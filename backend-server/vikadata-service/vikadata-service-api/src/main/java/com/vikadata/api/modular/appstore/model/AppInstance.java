package com.vikadata.api.modular.appstore.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 * 空间站应用信息视图
 * @author Shawn Deng
 * @date 2022-01-13 01:16:54
 */
@Data
@ApiModel("空间站应用实例视图")
public class AppInstance {

    @ApiModelProperty(value = "空间Id", example = "spc21u12h3")
    private String spaceId;

    @ApiModelProperty(value = "应用商城应用标识", example = "app-jh1237123")
    private String appId;

    @ApiModelProperty(value = "应用实例ID", example = "ai-jh1237123")
    private String appInstanceId;

    @ApiModelProperty(value = "是否启用", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isEnabled;

    @ApiModelProperty(value = "类型(LARK、WECOM、DINGTALK)", example = "LARK")
    private String type;

    @ApiModelProperty(value = "应用实例配置(类型不同，配置内容不同，做好泛型接收)")
    private InstanceConfig config;

    @ApiModelProperty(value = "创建时间", dataType = "string", example = "2020-03-18T15:29:59.000", position = 12)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;
}
