package com.vikadata.api.space.assembler;

import cn.hutool.core.collection.CollUtil;

import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.space.model.vo.SpaceSubscribeVo;

public class SubscribeAssembler {

    public SpaceSubscribeVo toVo(SubscriptionInfo subscriptionInfo) {
        SpaceSubscribeVo result = new SpaceSubscribeVo();
        result.setVersion(subscriptionInfo.getVersion());
        result.setProduct(subscriptionInfo.getProduct());
        result.setPlan(subscriptionInfo.getBasePlan());
        result.setOnTrial(subscriptionInfo.onTrial());
        result.setDeadline(subscriptionInfo.getEndDate());
        if (CollUtil.isNotEmpty(subscriptionInfo.getAddOnPlans())) {
            result.setAddOnPlans(subscriptionInfo.getAddOnPlans());
        }
        SubscriptionFeature feature = subscriptionInfo.getFeature();
        result.setMaxSeats(feature.getSeat().getValue());
        result.setMaxCapacitySizeInBytes(feature.getCapacitySize().getValue());
        result.setMaxSheetNums(feature.getSheetNums().getValue());
        result.setMaxRowsPerSheet(feature.getRowsPerSheet().getValue());
        result.setMaxRowsInSpace(feature.getRowNums().getValue());
        result.setMaxAdminNums(feature.getAdminNums().getValue());
        result.setMaxMirrorNums(feature.getMirrorNums().getValue());
        result.setMaxApiCall(feature.getApiCallNums().getValue());
        result.setMaxGalleryViewsInSpace(feature.getGalleryViews().getValue());
        result.setMaxKanbanViewsInSpace(feature.getKanbanViews().getValue());
        result.setMaxFormViewsInSpace(feature.getFormViews().getValue());
        result.setMaxGanttViewsInSpace(feature.getGanttViews().getValue());
        result.setMaxCalendarViewsInSpace(feature.getCalendarViews().getValue());
        result.setFieldPermissionNums(feature.getFieldPermissionNums().getValue());
        result.setNodePermissionNums(feature.getNodePermissionNums().getValue());

        result.setIntegrationFeishu(feature.getSocialConnect().getValue());
        result.setIntegrationDingtalk(feature.getSocialConnect().getValue());
        result.setIntegrationWeCom(feature.getSocialConnect().getValue());
        result.setIntegrationOfficePreview(feature.getSocialConnect().getValue());
        result.setRainbowLabel(feature.getRainbowLabel().getValue());
        result.setWatermark(feature.getWatermark().getValue());
        result.setSecuritySettingInviteMember(feature.getAllowInvitation().getValue());
        result.setSecuritySettingApplyJoinSpace(feature.getAllowApplyJoin().getValue());
        result.setSecuritySettingShare(feature.getAllowShare().getValue());
        result.setSecuritySettingExport(feature.getAllowExport().getValue());
        result.setSecuritySettingDownloadFile(feature.getAllowDownload().getValue());
        result.setSecuritySettingCopyCellData(feature.getAllowCopyData().getValue());
        result.setSecuritySettingMobile(feature.getShowMobileNumber().getValue());
        result.setSecuritySettingAddressListIsolation(feature.getContactIsolation().getValue());
        result.setSecuritySettingCatalogManagement(feature.getForbidCreateOnCatalog().getValue());

        result.setMaxRemainTimeMachineDays(feature.getRemainTimeMachineDays().getValue());
        result.setMaxRemainTrashDays(feature.getRemainTrashDays().getValue());
        result.setMaxRemainRecordActivityDays(feature.getRemainRecordActivityDays().getValue());
        result.setMaxAuditQueryDays(feature.getAuditQueryDays().getValue());

        result.setUnExpireGiftCapacity(subscriptionInfo.getGiftCapacity().getValue());
        result.setSubscriptionCapacity(feature.getCapacitySize().getValue() - subscriptionInfo.getGiftCapacity().getValue());
        return result;
    }
}
