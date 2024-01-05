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
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.AiAgentNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ApiCallNumsPerMonth;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ApiQpsNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ArchitectureViewNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ArchivedRowsPerSheet;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.AutomationRunNumsPerMonth;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CalendarViewNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CapacitySize;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.ColumnsPerSheet;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.DashboardNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.FieldPermissionNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.FileNodeNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.FormNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.GalleryViewNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.GanttViewNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.KanbanViewNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.MessageCreditNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.MirrorNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.NodePermissionNums;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.RowsPerSheet;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.Seat;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.SnapshotNumsPerSheet;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.TotalRows;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.WidgetNums;
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
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.AuditQuery;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ContactIsolation;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.ControlFormBrandLogo;
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

    FileNodeNums getFileNodeNums();

    default ColumnsPerSheet getColumnsPerSheet() {
        return new ColumnsPerSheet(30L);
    }

    RowsPerSheet getRowsPerSheet();

    default SnapshotNumsPerSheet getSnapshotNumsPerSheet() {
        return new SnapshotNumsPerSheet(0L);
    }

    ArchivedRowsPerSheet getArchivedRowsPerSheet();

    TotalRows getTotalRows();

    AdminNums getAdminNums();

    ApiCallNumsPerMonth getApiCallNumsPerMonth();

    default GalleryViewNums getGalleryViewNums() {
        return new GalleryViewNums(-1L);
    }

    default KanbanViewNums getKanbanViewNums() {
        return new KanbanViewNums(-1L);
    }

    default ArchitectureViewNums getArchitectureViewNums() {
        return new ArchitectureViewNums(-1L);
    }

    GanttViewNums getGanttViewNums();

    CalendarViewNums getCalendarViewNums();

    FormNums getFormNums();

    MirrorNums getMirrorNums();

    default DashboardNums getDashboardNums() {
        return new DashboardNums(0L);
    }

    default WidgetNums getWidgetNums() {
        return new WidgetNums(0L);
    }

    FieldPermissionNums getFieldPermissionNums();

    NodePermissionNums getNodePermissionNums();

    ApiQpsNums getApiQpsNums();

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

    ControlFormBrandLogo getControlFormBrandLogo();

    ShowMobileNumber getShowMobileNumber();

    ContactIsolation getContactIsolation();

    ForbidCreateOnCatalog getForbidCreateOnCatalog();

    RemainTrashDays getRemainTrashDays();

    RemainTimeMachineDays getRemainTimeMachineDays();

    RemainRecordActivityDays getRemainRecordActivityDays();

    @Deprecated(since = "1.7.0", forRemoval = true)
    AuditQueryDays getAuditQueryDays();

    default AuditQuery getAuditQuery() {
        return new AuditQuery(false);
    }

    AllowOrgApi getAllowOrgApi();

    default AiAgentNums getAiAgentNums() {
        return new AiAgentNums(0L);
    }

    default MessageCreditNums getMessageCreditNums() {
        return new MessageCreditNums(0L);
    }

    default AutomationRunNumsPerMonth getAutomationRunNumsPerMonth() {
        return new AutomationRunNumsPerMonth(0L);
    }
}
