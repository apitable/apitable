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

public interface SubscriptionFeature {

    Seat getSeat();

    CapacitySize getCapacitySize();

    SheetNums getSheetNums();

    RowsPerSheet getRowsPerSheet();

    RowNums getRowNums();

    MirrorNums getMirrorNums();

    AdminNums getAdminNums();

    ApiCallNums getApiCallNums();

    GalleryViews getGalleryViews();

    KanbanViews getKanbanViews();

    FormViews getFormViews();

    GanttViews getGanttViews();

    CalendarViews getCalendarViews();

    FieldPermissionNums getFieldPermissionNums();

    NodePermissionNums getNodePermissionNums();

    SocialConnect getSocialConnect();

    RainbowLabel getRainbowLabel();

    Watermark getWatermark();

    AllowInvitation getAllowInvitation();

    AllowApplyJoin getAllowApplyJoin();

    AllowShare getAllowShare();

    AllowExport getAllowExport();

    AllowDownload getAllowDownload();

    AllowCopyData getAllowCopyData();

    ShowMobileNumber getShowMobileNumber();

    ContactIsolation getContactIsolation();

    ForbidCreateOnCatalog getForbidCreateOnCatalog();

    RemainTrashDays getRemainTrashDays();

    RemainTimeMachineDays getRemainTimeMachineDays();

    RemainRecordActivityDays getRemainRecordActivityDays();

    AuditQueryDays getAuditQueryDays();
}
