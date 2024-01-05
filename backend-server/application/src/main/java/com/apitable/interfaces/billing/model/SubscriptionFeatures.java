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

import org.springframework.util.unit.DataSize;

/**
 * subscription features object collections.
 */
public class SubscriptionFeatures {

    /**
     * Consume features.
     */
    public static class ConsumeFeatures {

        /**
         * Seat feature.
         */
        public static class Seat extends NumberPlanFeature {

            public Seat(Long value) {
                super(value);
            }

            public Seat(Long value, boolean unlimited) {
                super(value, unlimited);
            }

            public static Seat unlimited(Long value) {
                return new Seat(value, true);
            }
        }

        /**
         * ApiQps feature.
         */
        public static class ApiQpsNums extends NumberPlanFeature {

            public ApiQpsNums(Long value) {
                super(value);
            }
        }

        /**
         * CapacitySize feature.
         */
        public static class CapacitySize extends DataSizePlanFeature {

            public CapacitySize(Long value) {
                super(DataSize.ofBytes(value));
            }
        }

        /**
         * SheetNums feature.
         */
        public static class FileNodeNums extends NumberPlanFeature {

            public FileNodeNums(Long value) {
                super(value);
            }
        }

        /**
         * ColumnsPerSheet feature.
         */
        public static class ColumnsPerSheet extends NumberPlanFeature {

            public ColumnsPerSheet(Long value) {
                super(value);
            }
        }

        /**
         * RowsPerSheet feature.
         */
        public static class RowsPerSheet extends NumberPlanFeature {

            public RowsPerSheet(Long value) {
                super(value);
            }
        }

        /**
         * ArchiveRowsPerSheet feature.
         */
        public static class ArchivedRowsPerSheet extends NumberPlanFeature {

            public ArchivedRowsPerSheet(Long value) {
                super(value);
            }
        }

        /**
         * RowNums feature.
         */
        public static class TotalRows extends NumberPlanFeature {

            public TotalRows(Long value) {
                super(value);
            }
        }

        /**
         * MirrorNums feature.
         */
        public static class MirrorNums extends NumberPlanFeature {

            public MirrorNums(Long value) {
                super(value);
            }
        }

        /**
         * AdminNums feature.
         */
        public static class AdminNums extends NumberPlanFeature {

            public AdminNums(Long value) {
                super(value);
            }
        }

        /**
         * ApiCallNums feature.
         */
        public static class ApiCallNumsPerMonth extends NumberPlanFeature {

            public ApiCallNumsPerMonth(Long value) {
                super(value);
            }
        }

        /**
         * GalleryViews feature.
         */
        public static class GalleryViewNums extends NumberPlanFeature {

            public GalleryViewNums(Long value) {
                super(value);
            }
        }

        /**
         * ArchitectureViews feature.
         */
        public static class ArchitectureViewNums extends NumberPlanFeature {

            public ArchitectureViewNums(Long value) {
                super(value);
            }
        }

        /**
         * KanbanViews feature.
         */
        public static class KanbanViewNums extends NumberPlanFeature {

            public KanbanViewNums(Long value) {
                super(value);
            }
        }

        /**
         * FormViews feature.
         */
        public static class FormNums extends NumberPlanFeature {

            public FormNums(Long value) {
                super(value);
            }
        }

        /**
         * GanttViews feature.
         */
        public static class GanttViewNums extends NumberPlanFeature {

            public GanttViewNums(Long value) {
                super(value);
            }
        }

        /**
         * CalendarViews feature.
         */
        public static class CalendarViewNums extends NumberPlanFeature {

            public CalendarViewNums(Long value) {
                super(value);
            }
        }

        /**
         * Dashboard Nums feature.
         */
        public static class DashboardNums extends NumberPlanFeature {

            public DashboardNums(Long value) {
                super(value);
            }
        }

        /**
         * FieldPermissionNums feature.
         */
        public static class FieldPermissionNums extends NumberPlanFeature {

            public FieldPermissionNums(Long value) {
                super(value);
            }
        }

        /**
         * NodePermissionNums feature.
         */
        public static class NodePermissionNums extends NumberPlanFeature {

            public NodePermissionNums(Long value) {
                super(value);
            }
        }

        /**
         * ai agent Nums feature.
         */
        public static class AiAgentNums extends NumberPlanFeature {

            public AiAgentNums(Long value) {
                super(value);
            }
        }

        /**
         * Credit Nums feature.
         */
        public static class MessageCreditNums extends NumberPlanFeature {

            public MessageCreditNums(Long value) {
                super(value);
            }
        }

        /**
         * Automation Nums feature.
         */
        public static class AutomationRunNumsPerMonth extends NumberPlanFeature {

            public AutomationRunNumsPerMonth(Long value) {
                super(value);
            }
        }

        /**
         * Widget Nums feature.
         */
        public static class WidgetNums extends NumberPlanFeature {

            public WidgetNums(Long value) {
                super(value);
            }
        }

        /**
         * Snapshot Nums Per Sheet feature.
         */
        public static class SnapshotNumsPerSheet extends NumberPlanFeature {

            public SnapshotNumsPerSheet(Long value) {
                super(value);
            }
        }
    }

    /**
     * Subscribe features.
     */
    public static class SubscribeFeatures {

        /**
         * SocialConnect feature.
         */
        public static class SocialConnect extends BooleanPlanFeature {

            public SocialConnect(Boolean value) {
                super(value);
            }
        }

        /**
         * RainbowLabel feature.
         */
        public static class RainbowLabel extends BooleanPlanFeature {

            public RainbowLabel(Boolean value) {
                super(value);
            }
        }

        /**
         * Watermark feature.
         */
        public static class Watermark extends BooleanPlanFeature {

            public Watermark(Boolean value) {
                super(value);
            }
        }

        /**
         * AllowInvitation feature.
         */
        public static class AllowInvitation extends BooleanPlanFeature {

            public AllowInvitation(Boolean value) {
                super(value);
            }
        }

        /**
         * AllowApplyJoin feature.
         */
        public static class AllowApplyJoin extends BooleanPlanFeature {

            public AllowApplyJoin(Boolean value) {
                super(value);
            }
        }

        /**
         * AllowShare feature.
         */
        public static class AllowShare extends BooleanPlanFeature {

            public AllowShare(Boolean value) {
                super(value);
            }
        }

        /**
         * AllowExport feature.
         */
        public static class AllowExport extends BooleanPlanFeature {

            public AllowExport(Boolean value) {
                super(value);
            }
        }

        /**
         * AllowDownload feature.
         */
        public static class AllowDownload extends BooleanPlanFeature {

            public AllowDownload(Boolean value) {
                super(value);
            }
        }

        /**
         * AllowCopyData feature.
         */
        public static class AllowCopyData extends BooleanPlanFeature {

            public AllowCopyData(Boolean value) {
                super(value);
            }
        }

        /**
         * ShowMobileNumber feature.
         */
        public static class ShowMobileNumber extends BooleanPlanFeature {

            public ShowMobileNumber(Boolean value) {
                super(value);
            }
        }

        /**
         * ContactIsolation feature.
         */
        public static class ContactIsolation extends BooleanPlanFeature {

            public ContactIsolation(Boolean value) {
                super(value);
            }
        }

        /**
         * ForbidCreateOnCatalog feature.
         */
        public static class ForbidCreateOnCatalog extends BooleanPlanFeature {

            public ForbidCreateOnCatalog(Boolean value) {
                super(value);
            }
        }

        /**
         * AllowEmbed feature.
         */
        public static class AllowEmbed extends BooleanPlanFeature {

            public AllowEmbed(Boolean value) {
                super(value);
            }
        }

        /**
         * Billing OrgApi feature.
         */
        public static class AllowOrgApi extends BooleanPlanFeature {
            public AllowOrgApi(Boolean value) {
                super(value);
            }
        }

        /**
         * Billing OrgApi feature.
         */
        public static class AuditQuery extends BooleanPlanFeature {
            public AuditQuery(Boolean value) {
                super(value);
            }
        }

        /**
         * Billing form brand log feature.
         */
        public static class ControlFormBrandLogo extends BooleanPlanFeature {
            public ControlFormBrandLogo(Boolean value) {
                super(value);
            }
        }
    }

    /**
     * Solid features.
     */
    public static class SolidFeatures {

        /**
         * RemainTrashDays feature.
         */
        public static class RemainTrashDays extends NumberPlanFeature {

            public RemainTrashDays(Long value) {
                super(value);
            }
        }

        /**
         * RemainTimeMachineDays feature.
         */
        public static class RemainTimeMachineDays extends NumberPlanFeature {

            public RemainTimeMachineDays(Long value) {
                super(value);
            }
        }

        /**
         * RemainRecordActivityDays feature.
         */
        public static class RemainRecordActivityDays extends NumberPlanFeature {

            public RemainRecordActivityDays(Long value) {
                super(value);
            }
        }

        /**
         * AuditQueryDays feature.
         */
        public static class AuditQueryDays extends NumberPlanFeature {

            public AuditQueryDays(Long value) {
                super(value);
            }
        }
    }

    public static ConsumeFeatures.CapacitySize buildCapacitySize(DataSize value) {
        return new ConsumeFeatures.CapacitySize(value.toBytes());
    }

    public static ConsumeFeatures.CapacitySize buildCapacitySize(Long value) {
        return new ConsumeFeatures.CapacitySize(value);
    }

    public static ConsumeFeatures.Seat buildSeat(Long value) {
        return new ConsumeFeatures.Seat(value);
    }

    public static ConsumeFeatures.FileNodeNums buildFileNodeNums(Long value) {
        return new ConsumeFeatures.FileNodeNums(value);
    }

    public static ConsumeFeatures.AdminNums buildAdminNums(Long value) {
        return new ConsumeFeatures.AdminNums(value);
    }

    public static ConsumeFeatures.NodePermissionNums buildNodePermissionNums(Long value) {
        return new ConsumeFeatures.NodePermissionNums(value);
    }

    public static ConsumeFeatures.FieldPermissionNums buildFieldPermissionNums(Long value) {
        return new ConsumeFeatures.FieldPermissionNums(value);
    }

    public static ConsumeFeatures.ColumnsPerSheet buildColumnsPerSheet(Long value) {
        return new ConsumeFeatures.ColumnsPerSheet(value);
    }

    public static ConsumeFeatures.RowsPerSheet buildRowsPerSheet(Long value) {
        return new ConsumeFeatures.RowsPerSheet(value);
    }

    public static ConsumeFeatures.ArchivedRowsPerSheet buildArchivedRowsPerSheet(Long value) {
        return new ConsumeFeatures.ArchivedRowsPerSheet(value);
    }

    public static ConsumeFeatures.TotalRows buildTotalRows(Long value) {
        return new ConsumeFeatures.TotalRows(value);
    }

    public static SubscribeFeatures.AllowOrgApi buildAllowOrgApi(Boolean value) {
        return new SubscribeFeatures.AllowOrgApi(value);
    }

    public static ConsumeFeatures.ApiQpsNums buildApiQpsNums(Long value) {
        return new ConsumeFeatures.ApiQpsNums(value);
    }

    public static ConsumeFeatures.ApiCallNumsPerMonth buildApiCallNumsPerMonth(Long value) {
        return new ConsumeFeatures.ApiCallNumsPerMonth(value);
    }

    public static ConsumeFeatures.MirrorNums buildMirrorNums(Long value) {
        return new ConsumeFeatures.MirrorNums(value);
    }

    public static ConsumeFeatures.GanttViewNums buildGanttViewNums(Long value) {
        return new ConsumeFeatures.GanttViewNums(value);
    }

    public static ConsumeFeatures.CalendarViewNums buildCalendarViewNums(Long value) {
        return new ConsumeFeatures.CalendarViewNums(value);
    }

    public static ConsumeFeatures.FormNums buildFormNums(Long value) {
        return new ConsumeFeatures.FormNums(value);
    }

    public static ConsumeFeatures.KanbanViewNums buildKanbanViewNums(Long value) {
        return new ConsumeFeatures.KanbanViewNums(value);
    }

    public static ConsumeFeatures.GalleryViewNums buildGalleryViewNums(Long value) {
        return new ConsumeFeatures.GalleryViewNums(value);
    }

    public static ConsumeFeatures.ArchitectureViewNums buildArchitectureViewNums(Long value) {
        return new ConsumeFeatures.ArchitectureViewNums(value);
    }

    public static ConsumeFeatures.DashboardNums buildDashboardNums(Long value) {
        return new ConsumeFeatures.DashboardNums(value);
    }

    public static ConsumeFeatures.WidgetNums buildWidgetNums(Long value) {
        return new ConsumeFeatures.WidgetNums(value);
    }

    public static ConsumeFeatures.AiAgentNums buildAiAgentNums(Long value) {
        return new ConsumeFeatures.AiAgentNums(value);
    }

    public static ConsumeFeatures.MessageCreditNums buildMessageCreditNums(Long value) {
        return new ConsumeFeatures.MessageCreditNums(value);
    }

    public static ConsumeFeatures.AutomationRunNumsPerMonth buildAutomationRunNums(Long value) {
        return new ConsumeFeatures.AutomationRunNumsPerMonth(value);
    }

    public static SolidFeatures.RemainTrashDays buildRemainTrashDays(Long value) {
        return new SolidFeatures.RemainTrashDays(value);
    }

    public static SolidFeatures.RemainTimeMachineDays buildRemainTimeMachineDays(Long value) {
        return new SolidFeatures.RemainTimeMachineDays(value);
    }

    public static SolidFeatures.RemainRecordActivityDays buildRemainRecordActivityDays(Long value) {
        return new SolidFeatures.RemainRecordActivityDays(value);
    }

    public static SolidFeatures.AuditQueryDays buildAuditQueryDays(Long value) {
        return new SolidFeatures.AuditQueryDays(value);
    }

    public static ConsumeFeatures.SnapshotNumsPerSheet buildSnapshotNumsPerSheet(Long value) {
        return new ConsumeFeatures.SnapshotNumsPerSheet(value);
    }

    public static SubscribeFeatures.SocialConnect buildSocialConnect(Boolean value) {
        return new SubscribeFeatures.SocialConnect(value);
    }

    public static SubscribeFeatures.RainbowLabel buildRainbowLabel(Boolean value) {
        return new SubscribeFeatures.RainbowLabel(value);
    }

    public static SubscribeFeatures.Watermark buildWatermark(Boolean value) {
        return new SubscribeFeatures.Watermark(value);
    }

    public static SubscribeFeatures.AllowInvitation buildAllowInvitation(Boolean value) {
        return new SubscribeFeatures.AllowInvitation(value);
    }

    public static SubscribeFeatures.AllowApplyJoin buildAllowApplyJoin(Boolean value) {
        return new SubscribeFeatures.AllowApplyJoin(value);
    }

    public static SubscribeFeatures.AllowShare buildAllowShare(Boolean value) {
        return new SubscribeFeatures.AllowShare(value);
    }

    public static SubscribeFeatures.AllowExport buildAllowExport(Boolean value) {
        return new SubscribeFeatures.AllowExport(value);
    }

    public static SubscribeFeatures.AllowDownload buildAllowDownload(Boolean value) {
        return new SubscribeFeatures.AllowDownload(value);
    }

    public static SubscribeFeatures.AllowCopyData buildAllowCopyData(Boolean value) {
        return new SubscribeFeatures.AllowCopyData(value);
    }

    public static SubscribeFeatures.ShowMobileNumber buildShowMobileNumber(Boolean value) {
        return new SubscribeFeatures.ShowMobileNumber(value);
    }

    public static SubscribeFeatures.ContactIsolation buildContactIsolation(Boolean value) {
        return new SubscribeFeatures.ContactIsolation(value);
    }

    public static SubscribeFeatures.ForbidCreateOnCatalog buildForbidCreateOnCatalog(
        Boolean value) {
        return new SubscribeFeatures.ForbidCreateOnCatalog(value);
    }

    public static SubscribeFeatures.AllowEmbed buildAllowEmbed(Boolean value) {
        return new SubscribeFeatures.AllowEmbed(value);
    }

    public static SubscribeFeatures.AuditQuery buildAuditQuery(Boolean value) {
        return new SubscribeFeatures.AuditQuery(value);
    }

    public static SubscribeFeatures.ControlFormBrandLogo buildControlFormBrandLogo(Boolean value) {
        return new SubscribeFeatures.ControlFormBrandLogo(value);
    }
}
