/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.interfaces.billing.model;

import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.AdminNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ApiCallNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ApiQps;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ArchivedRowsPerSheet;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CalendarViews;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CapacitySize;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.FieldPermissionNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.FormViews;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.GalleryViews;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.GanttViews;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.KanbanViews;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.MessageCreditNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.MessageAutomationRunNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.MessageWidgetNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.MirrorNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.NodePermissionNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.RowNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.RowsPerSheet;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.Seat;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.SheetNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.AuditQueryDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainRecordActivityDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTimeMachineDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTrashDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowApplyJoin;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowCopyData;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowDownload;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowEmbed;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowExport;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowInvitation;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowOrgApi;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AllowShare;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ContactIsolation;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ForbidCreateOnCatalog;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.RainbowLabel;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ShowMobileNumber;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.SocialConnect;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.Watermark;

/**
 * subscription feature interface.
 */
public interface SubscriptionFeature {

    Seat getSeat();

    CapacitySize getCapacitySize();

    SheetNums getSheetNums();

    RowsPerSheet getRowsPerSheet();

    ArchivedRowsPerSheet getArchivedRowsPerSheet();

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

    ApiQps getApiQps();

    SocialConnect getSocialConnect();

    RainbowLabel getRainbowLabel();

    Watermark getWatermark();

    AllowInvitation getAllowInvitation();

    AllowApplyJoin getAllowApplyJoin();

    AllowShare getAllowShare();

    AllowExport getAllowExport();

    AllowDownload getAllowDownload();

    AllowCopyData getAllowCopyData();

    AllowEmbed getAllowEmbed();

    ShowMobileNumber getShowMobileNumber();

    ContactIsolation getContactIsolation();

    ForbidCreateOnCatalog getForbidCreateOnCatalog();

    RemainTrashDays getRemainTrashDays();

    RemainTimeMachineDays getRemainTimeMachineDays();

    RemainRecordActivityDays getRemainRecordActivityDays();

    AuditQueryDays getAuditQueryDays();

    AllowOrgApi getAllowOrgApi();

    default MessageCreditNums getMessageCreditNums() {
        return new MessageCreditNums(0L);
    }

    default MessageAutomationRunNums getMessageAutomationRunNums() {
        return new MessageAutomationRunNums(0L);
    }

    default MessageWidgetNums getMessageWidgetNums() {
        return new MessageWidgetNums(0L);
    }
}
