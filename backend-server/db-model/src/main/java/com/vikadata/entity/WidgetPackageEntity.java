package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 工作台-组件包信息表
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName(keepGlobalPrefix = true, value = "widget_package")
public class WidgetPackageEntity implements Serializable {

    private static final long serialVersionUID = 1L;

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
     * 国际化组件名称
     */
    private String i18nName;

    /**
     * 国际化组件描述
     */
    private String i18nDescription;

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
     * 名称 - 【废弃删除】
     */
    private String name;

    /**
     * 英文名称 - 【废弃删除】
     */
    private String nameEn;

    /**
     * 版本 - 【废弃删除】
     */
    private String version;

    /**
     * 描述 - 【废弃删除】
     */
    private String description;

    /**
     * 作者名
     */
    private String authorName;

    /**
     * 作者email
     */
    private String authorEmail;

    /**
     * 作者图标TOKEN
     */
    private String authorIcon;

    /**
     * 作者网站地址
     */
    private String authorLink;

    /**
     * 组件包类型(0:第三方,1:官方)
     */
    private Integer packageType;

    /**
     * 0：发布到空间站中的组件商店，1：发布到全局应用商店（只有 package_type 为 0 才允许），
     * 10：待发布小程序，全局小程序submit后产生的镜像小程序
     */
    private Integer releaseType;

    /**
     * 组件包扩展信息
     */
    private String widgetBody;

    /**
     * 是否沙箱运行(0:否,1:是)
     */
    private Boolean sandbox;

    /**
     * release版本id，当前激活的版本，可为空，空的时候，在组建商店只展示给创建者
     */
    private Long releaseId;

    /**
     * 是否模版(0:否,1:是)
     */
    private Boolean isTemplate;

    /**
     * 是否启用，只针对全局小组件(0:未启用,1:启用)
     */
    private Boolean isEnabled;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 拥有者Id(关联#vika_user#id)
     */
    private Long owner;

    /**
     * 创建者
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 最后修改者
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
