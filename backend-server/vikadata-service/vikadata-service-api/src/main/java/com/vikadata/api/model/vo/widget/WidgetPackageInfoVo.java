package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;

/**
 * <p>
 * 小程序包信息视图
 * </p>
 *
 * @author Pengap
 * @date 2021/7/9
 */
@Data
@ApiModel("小程序包信息视图")
public class WidgetPackageInfoVo {

    @ApiModelProperty(value = "组件包ID", example = "wpkABC", position = 1)
    private String packageId;

    @ApiModelProperty(value = "组件名称-根据请求Accept-Language返回，默认：zh-CN，目前支持列表：「en-US/zh-CN」", example = "图表", position = 2)
    private String name;

    @ApiModelProperty(value = "组件包图标", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "组件包封面图", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 4)
    @JsonSerialize(using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "组件描述-根据请求Accept-Language返回，默认：zh-CN，目前支持列表：「en-US/zh-CN」", example = "这是一个图表小程序的描述", position = 5)
    private String description;

    @ApiModelProperty(value = "组件包版本号", example = "1.0.0", position = 6)
    private String version;

    @ApiModelProperty(value = "组件包状态(0:开发中;1:已封禁;2:待发布;3:已发布;4:已下架)", example = "3", position = 7)
    private Integer status;

    @ApiModelProperty(value = "作者名", position = 8)
    private String authorName;

    @ApiModelProperty(value = "作者图标", position = 9)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "作者Email", position = 10)
    private String authorEmail;

    @ApiModelProperty(value = "作者网站地址", position = 11)
    private String authorLink;

    @ApiModelProperty(value = "组件包类型(0:第三方,1:官方)", position = 12)
    private Integer packageType;

    @ApiModelProperty(value = "0：发布到空间站中的组件商店，1：发布到全局应用商店", position = 13)
    private Integer releaseType;

}
