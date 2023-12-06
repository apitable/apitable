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
        public static class ApiCallNums extends NumberPlanFeature {

            public ApiCallNums(Long value) {
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
        public static class FormViewNums extends NumberPlanFeature {

            public FormViewNums(Long value) {
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
        public static class AutomationRunNums extends NumberPlanFeature {

            public AutomationRunNums(Long value) {
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
}
