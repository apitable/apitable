package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.enums.widget.InstallEnvType;
import com.vikadata.api.enums.widget.RuntimeEnvType;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

import java.util.List;

/**
 * <p>
 * 组件包信息（对齐前端结构要求）
 * </p>
 *
 * @author Chambers
 * @date 2021/01/11
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("组件包信息")
public class WidgetPack {

    @ApiModelProperty(value = "组件ID", example = "wdt123", position = 1)
    private String id;

    @ApiModelProperty(value = "组件版本号", example = "0", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long revision;

    @ApiModelProperty(value = "组件包ID", example = "wpkABC", position = 3)
    private String widgetPackageId;

    @ApiModelProperty(value = "组件包名称", example = "图表", position = 4)
    private String widgetPackageName;

    @ApiModelProperty(value = "组件包英文名称（废弃字段）", example = "chart", position = 4)
    @Deprecated
    private String widgetPackageNameEn;

    @ApiModelProperty(value = "组件包图标", example = "https://s1.vika.cn/space/2020/12/23/aqa", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageIcon;

    @ApiModelProperty(value = "组件包版本号", example = "v1.0.0", position = 6)
    private String widgetPackageVersion;

    @ApiModelProperty(value = "组件快照信息", position = 7)
    private WidgetSnapshot snapshot;

    @ApiModelProperty(value = "组件状态(0:开发中;1:已封禁;2:待发布;3:已发布;4:已下架)", position = 8)
    private Integer status;

    @ApiModelProperty(value = "组件作者名称", position = 9)
    private String authorName;

    @ApiModelProperty(value = "组件快作者Email", position = 10)
    private String authorEmail;

    @ApiModelProperty(value = "组件作者图标", position = 11)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "组件作者网站地址", position = 12)
    private String authorLink;

    @ApiModelProperty(value = "组件包类型(0:第三方,1:官方)", position = 13)
    private Integer packageType;

    @ApiModelProperty(value = "组件发布类型(0:空间站,1:全局)", position = 14)
    private Integer releaseType;

    @ApiModelProperty(value = "组件代码地址", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 15)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "是否沙箱", position = 16)
    private Boolean sandbox;

    @JsonInclude(Include.NON_EMPTY)
    @ApiModelProperty(value = "审核小程序归属父级小程序Id", notes = "动态key", position = 17)
    private String fatherWidgetPackageId;

    @ApiModelProperty(value = "安装环境类型", example = "dashboard", position = 18)
    private List<String> installEnv;

    @ApiModelProperty(value = "运行环境类型", example = "mobile", position = 19)
    private List<String> runtimeEnv;

}
