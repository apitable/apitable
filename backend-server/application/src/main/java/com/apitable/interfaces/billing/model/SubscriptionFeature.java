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

import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.*;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.AuditQueryDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainRecordActivityDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTimeMachineDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTrashDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.*;

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

    AllowEmbed getAllowEmbed();

    ShowMobileNumber getShowMobileNumber();

    ContactIsolation getContactIsolation();

    ForbidCreateOnCatalog getForbidCreateOnCatalog();

    RemainTrashDays getRemainTrashDays();

    RemainTimeMachineDays getRemainTimeMachineDays();

    RemainRecordActivityDays getRemainRecordActivityDays();

    AuditQueryDays getAuditQueryDays();
}
