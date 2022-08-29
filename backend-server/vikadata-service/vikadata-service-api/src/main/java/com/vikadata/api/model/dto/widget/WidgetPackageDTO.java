package com.vikadata.api.model.dto.widget;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

/**
 * <p>
 * 小组件包DTO
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-05-20
 */
@Data
public class WidgetPackageDTO {

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 组件包ID
     */
    private String packageId;

    /**
     * 组件名称
     */
    private String name;

    /**
     * 组件描述
     */
    private String description;

    /**
     * 图标
     */
    private String icon;

    /**
     * 封面图TOKEN
     */
    private String cover;

    /**
     * 状态(0:开发中,1:已封禁,2:待发布,3:已发布,4:已下架-全局暂不开放)目前保留3，4
     */
    private Integer status;

    /**
     * 安装次数
     */
    private Integer installedNum;

    /**
     * 作者名
     */
    private String authorName;

    /**
     * 作者图标
     */
    private String authorIcon;

    /**
     * 作者email
     */
    private String authorEmail;

    /**
     * 作者网站地址
     */
    private String authorLink;

    /**
     * 组件包类型(0:第三方,1:官方)
     */
    private Integer packageType;

    /**
     * 0：发布到空间站中的组件商店，1：发布到全局应用商店（只有 package_type 为 0 才允许）
     */
    private Integer releaseType;

    /**
     * 组件版本
     */
    private String version;

    /**
     * 代码地址
     */
    private String releaseCodeBundle;

    /**
     * 是否沙箱运行(0:否,1:是)
     */
    private Boolean sandbox;

    /**
     * 兼容数据
     */
    @Deprecated
    private String nameEn;

    /**
     * 审核小程序归属父级小程序Id
     */
    private String fatherWidgetId;

    /**
     * 安装环境编码
     */
    private String installEnvCode;

    /**
     * 运行环境编码
     */
    private  String runtimeEnvCode;
}
