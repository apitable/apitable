package com.vikadata.api.enterprise.billing.util.model;

import lombok.Data;

/**
 * <p>
 * billing plan feature
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class BillingPlanFeature {

    private Long maxSeats;

    private Long maxCapacitySizeInBytes;

    private Long maxSheetNums;

    private Long maxRowsPerSheet;

    private Long maxRowsInSpace;

    private Long maxAdminNums;

    private Long maxRemainTrashDays;

    private Long maxApiCall;

    private Long maxGalleryViewsInSpace;

    private Long maxKanbanViewsInSpace;

    private Long maxFormViewsInSpace;

    private Long maxGanttViewsInSpace;

    private Long maxCalendarViewsInSpace;

    private Long fieldPermissionNums;

    private Long nodePermissionNums;

    private Long maxRemainTimeMachineDays;

    private Boolean integrationDingtalk;

    private Boolean integrationFeishu;

    private Boolean integrationWeCom;

    private Boolean integrationOfficePreview;

    private Boolean rainbowLabel;

    private Boolean watermark;

    private Long maxRemainRecordActivityDays;

    private Boolean securitySettingInviteMember;

    private Boolean securitySettingApplyJoinSpace;

    private Boolean securitySettingShare;

    private Boolean securitySettingExport;

    private Boolean securitySettingDownloadFile;

    private Boolean securitySettingCopyCellData;

    private Boolean securitySettingMobile;

    private Long maxAuditQueryDays;

    private Boolean securitySettingAddressListIsolation;

    private Boolean securitySettingCatalogManagement;

    private Long maxMirrorNums;
}
