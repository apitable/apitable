package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 小程序商店列表信息视图
 * </p>
 * @author Pengap
 * @date 2021/9/28 14:56:57
 */
@Data
@ApiModel("小程序商店列表信息视图")
public class WidgetWaitReviewListInfo {

    @ApiModelProperty(value = "组件包ID", example = "wpkABC", position = 1)
    private String widgetPackageId;

    @ApiModelProperty(value = "组件包名称", example = "图表", position = 2)
    private String name;

    @ApiModelProperty(value = "组件包图标", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "组件包封面图", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "描述", example = "这是一个图表小程序的描述", position = 4)
    private String description;

    @ApiModelProperty(value = "组件包版本号", example = "1.0.0", position = 5)
    private String version;

    @ApiModelProperty(value = "作者名", position = 6)
    private String authorName;

    @ApiModelProperty(value = "作者图标", position = 7)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "作者Email", position = 8)
    private String authorEmail;

    @ApiModelProperty(value = "作者网站地址", position = 9)
    private String authorLink;

    @ApiModelProperty(value = "组件包类型(0:第三方,1:官方)", position = 10)
    private Integer packageType;

    // @ApiModelProperty(value = "0：发布到空间站中的组件商店，1：发布到全局应用商店", position = 11)
    // private Integer releaseType;
    // @ApiModelProperty(value = "组件包状态(0:待审核;1:不通过;2:待发布;3:已上线;4:已下架)", example = "3", position = 12)
    // private Integer status;
    // @ApiModelProperty(value = "是否他人授权的小程序(false:否,true:是)", example = "false", position = 13)
    // private Boolean isEmpower;
    // @ApiModelProperty(value = "小程序拥有者UUID", position = 14)
    // private String ownerUuid;
    // @ApiModelProperty(value = "小程序拥有者MemberId", position = 15)
    // private String ownerMemberId;

    @ApiModelProperty(value = "小程序商店列表扩展信息", position = 16)
    private WidgetStoreListExtraInfo extras;

    @JsonIgnore
    private Long releaseId;

    @JsonIgnore
    private String widgetBody;

}
