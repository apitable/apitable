package com.vikadata.api.interfaces.billing.model;

import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.AdminNums;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ApiCallNums;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CalendarViews;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CapacitySize;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.FieldPermissionNums;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.FormViews;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.GalleryViews;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.GanttViews;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.KanbanViews;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.MirrorNums;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.NodePermissionNums;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.RowNums;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.RowsPerSheet;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.Seat;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.SheetNums;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.AuditQueryDays;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainRecordActivityDays;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTimeMachineDays;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTrashDays;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowApplyJoin;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowCopyData;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowDownload;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowExport;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowInvitation;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowShare;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ContactIsolation;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ForbidCreateOnCatalog;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.RainbowLabel;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ShowMobileNumber;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.SocialConnect;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.Watermark;

public class DefaultSubscriptionFeature implements SubscriptionFeature {

    @Override
    public Seat getSeat() {
        return new Seat(-1L);
    }

    @Override
    public CapacitySize getCapacitySize() {
        return new CapacitySize(-1L);
    }

    @Override
    public SheetNums getSheetNums() {
        return new SheetNums(-1L);
    }

    @Override
    public RowsPerSheet getRowsPerSheet() {
        return new RowsPerSheet(-1L);
    }

    @Override
    public RowNums getRowNums() {
        return new RowNums(-1L);
    }

    @Override
    public MirrorNums getMirrorNums() {
        return new MirrorNums(-1L);
    }

    @Override
    public AdminNums getAdminNums() {
        return new AdminNums(-1L);
    }

    @Override
    public ApiCallNums getApiCallNums() {
        return new ApiCallNums(-1L);
    }

    @Override
    public GalleryViews getGalleryViews() {
        return new GalleryViews(-1L);
    }

    @Override
    public KanbanViews getKanbanViews() {
        return new KanbanViews(-1L);
    }

    @Override
    public FormViews getFormViews() {
        return new FormViews(-1L);
    }

    @Override
    public GanttViews getGanttViews() {
        return new GanttViews(-1L);
    }

    @Override
    public CalendarViews getCalendarViews() {
        return new CalendarViews(-1L);
    }

    @Override
    public FieldPermissionNums getFieldPermissionNums() {
        return new FieldPermissionNums(-1L);
    }

    @Override
    public NodePermissionNums getNodePermissionNums() {
        return new NodePermissionNums(-1L);
    }

    @Override
    public SocialConnect getSocialConnect() {
        return new SocialConnect(false);
    }

    @Override
    public RainbowLabel getRainbowLabel() {
        return new RainbowLabel(false);
    }

    @Override
    public Watermark getWatermark() {
        return new Watermark(false);
    }

    @Override
    public AllowInvitation getAllowInvitation() {
        return new AllowInvitation(false);
    }

    @Override
    public AllowApplyJoin getAllowApplyJoin() {
        return new AllowApplyJoin(false);
    }

    @Override
    public AllowShare getAllowShare() {
        return new AllowShare(false);
    }

    @Override
    public AllowExport getAllowExport() {
        return new AllowExport(false);
    }

    @Override
    public AllowDownload getAllowDownload() {
        return new AllowDownload(false);
    }

    @Override
    public AllowCopyData getAllowCopyData() {
        return new AllowCopyData(false);
    }

    @Override
    public ShowMobileNumber getShowMobileNumber() {
        return new ShowMobileNumber(false);
    }

    @Override
    public ContactIsolation getContactIsolation() {
        return new ContactIsolation(false);
    }

    @Override
    public ForbidCreateOnCatalog getForbidCreateOnCatalog() {
        return new ForbidCreateOnCatalog(false);
    }

    @Override
    public RemainTrashDays getRemainTrashDays() {
        return new RemainTrashDays(-1L);
    }

    @Override
    public RemainTimeMachineDays getRemainTimeMachineDays() {
        return new RemainTimeMachineDays(-1L);
    }

    @Override
    public RemainRecordActivityDays getRemainRecordActivityDays() {
        return new RemainRecordActivityDays(-1L);
    }

    @Override
    public AuditQueryDays getAuditQueryDays() {
        return new AuditQueryDays(-1L);
    }
}
