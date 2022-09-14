package com.vikadata.api.util.billing.model;

import lombok.Data;

/**
 * <p>
 * 订阅方案功能限制点
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class BillingPlanFeature {

    /**
     * 方案对应的最大席位数
     */
    private Long maxSeats;

    /**
     * 方案对应的最大附件容量（单位：字节）
     */
    private Long maxCapacitySizeInBytes;

    /**
     * 方案对应最大维格表数量
     */
    private Long maxSheetNums;

    /**
     * 方案对应单个表最大行数
     */
    private Long maxRowsPerSheet;

    /**
     * 方案对应的空间所有表的总行数
     */
    private Long maxRowsInSpace;

    /**
     * 方案对应的管理员数量
     */
    private Long maxAdminNums;

    /**
     * 方案对应的回收站最大保存天数
     */
    private Long maxRemainTrashDays;

    /**
     * 方案对应的API用量数
     *
     * @since 0.8.0
     */
    private Long maxApiCall;

    /**
     * 方案对应的最大相册视图数量
     *
     * @since 0.8.0
     */
    private Long maxGalleryViewsInSpace;

    /**
     * 方案对应的最大看板视图数量
     *
     * @since 0.8.0
     */
    private Long maxKanbanViewsInSpace;

    /**
     * 方案对应的最大神奇表单数量
     *
     * @since 0.8.0
     */
    private Long maxFormViewsInSpace;

    /**
     * 方案对应的最大甘特视图数量
     *
     * @since 0.8.0
     */
    private Long maxGanttViewsInSpace;

    /**
     * 方案对应的最大日历视图数量
     *
     * @since 0.8.0
     */
    private Long maxCalendarViewsInSpace;

    /**
     * 方案对应的空间站可设置列权限数量
     *
     * @since 0.8.0
     */
    private Long fieldPermissionNums;

    /**
     * 方案对应的空间站可设置文件权限数量
     *
     * @since 0.8.0
     */
    private Long nodePermissionNums;

    /**
     * 方案对应的单个表的时光机保留天数
     *
     * @since 0.8.0
     */
    private Long maxRemainTimeMachineDays;

    /**
     * 方案对应的钉钉集成功能
     *
     * @since 0.8.0
     */
    private Boolean integrationDingtalk;

    /**
     * 方案对应的飞书集成功能
     *
     * @since 0.8.0
     */
    private Boolean integrationFeishu;

    /**
     * 方案对应的企业微信集成功能
     *
     * @since 0.8.0
     */
    private Boolean integrationWeCom;

    /**
     * 方案对应的永中Office集成功能
     *
     * @since 0.8.0
     */
    private Boolean integrationOfficePreview;

    /**
     * 方案对应的彩虹标签功能
     *
     * @since 0.8.0
     */
    private Boolean rainbowLabel;

    /**
     * 方案对应的全局水印功能
     *
     * @since 0.8.0
     */
    private Boolean watermark;

    /**
     * 方案对应的单个表的动态保留天数
     *
     * @since 0.12.4
     */
    private Long maxRemainRecordActivityDays;

    /**
     * 安全设置-普通成员进行邀请操作
     *
     * @since 0.12.8
     */
    private Boolean securitySettingInviteMember;

    /**
     * 安全设置-站外用户申请加入空间站
     *
     * @since 0.12.8
     */
    private Boolean securitySettingApplyJoinSpace;

    /**
     * 安全设置-创建公开链接
     *
     * @since 0.12.8
     */
    private Boolean securitySettingShare;

    /**
     * 安全设置-导出维格表和视图
     *
     * @since 0.12.8
     */
    private Boolean securitySettingExport;

    /**
     * 安全设置-只读用户下载附件
     *
     * @since 0.12.8
     */
    private Boolean securitySettingDownloadFile;

    /**
     * 安全设置-只读用户将数据复制到站外
     *
     * @since 0.12.8
     */
    private Boolean securitySettingCopyCellData;

    /**
     * 安全设置-显示成员手机号
     *
     * @since 0.12.8
     */
    private Boolean securitySettingMobile;

    /**
     * 审计日志最大可查询天数(单位: 天)
     */
    private Long maxAuditQueryDays;

    /**
     * 安全设置-通讯录隐藏
     *
     * @since 0.13.7
     */
    private Boolean securitySettingAddressListIsolation;

    /**
     * 安全设置-禁止成员在根目录增删文件
     *
     * @since 0.13.7
     */
    private Boolean securitySettingCatalogManagement;
}
