package com.vikadata.api.modular.appstore.model;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 * 应用信息视图
 * @author Shawn Deng
 * @date 2022-01-12 11:48:17
 */
@Data
@ApiModel("应用信息视图")
public class AppInfo {

    @ApiModelProperty(value = "应用标识", dataType = "String", example = "app-jh1237123")
    private String appId;

    @ApiModelProperty(value = "应用名称", dataType = "String", example = "飞书")
    private String name;

    @ApiModelProperty(value = "类型(LARK、WECOM、DINGTALK)", dataType = "String", example = "LARK")
    private String type;

    @ApiModelProperty(value = "应用类型(具体看目录)", dataType = "String", example = "SOCIAL")
    private String appType;

    @ApiModelProperty(value = "应用状态", dataType = "String", example = "ACTIVE")
    private String status;

    @ApiModelProperty(value = "应用简介", dataType = "String", example = "和飞书无缝结合....")
    private String intro;

    @ApiModelProperty(value = "帮助文档路径", dataType = "String", example = "/help/path")
    private String helpUrl;

    @ApiModelProperty(value = "应用描述", dataType = "String", example = "long text")
    private String description;

    @ApiModelProperty(value = "展示图片列表，有序展示", dataType = "List", example = "[url1, url2....]")
    private List<String> displayImages;

    @ApiModelProperty(value = "提醒注意说明", dataType = "String", example = "注意：xxx")
    private String notice;

    @ApiModelProperty(value = "应用LOGO地址", dataType = "String", example = "feishu_logo")
    private String logoUrl;

    @ApiModelProperty(value = "是否需要配置", dataType = "Boolean", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean needConfigured;

    @ApiModelProperty(value = "配置跳转路径", dataType = "String", example = "/path")
    private String configureUrl;

    @ApiModelProperty(value = "停用调整链接，没有则不需要跳转", dataType = "String", example = "https://feishu.cn/admin/xxx")
    private String stopActionUrl;

    @ApiModelProperty(value = "是否需要授权启用操作", dataType = "Boolean", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean needAuthorize;
}
