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
    public AllowEmbed getAllowEmbed() {
        return new AllowEmbed(false);
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
