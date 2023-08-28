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
        public static class Seat extends AbstractNumberPlanFeature {

            public Seat(Long value) {
                super(value);
            }
        }

        /**
         * ApiQps feature.
         */
        public static class ApiQps extends AbstractNumberPlanFeature {

            public ApiQps(Long value) {
                super(value);
            }
        }

        /**
         * CapacitySize feature.
         */
        public static class CapacitySize extends AbstractNumberPlanFeature {

            public CapacitySize(Long value) {
                super(value);
            }
        }

        /**
         * SheetNums feature.
         */
        public static class SheetNums extends AbstractNumberPlanFeature {

            public SheetNums(Long value) {
                super(value);
            }
        }

        /**
         * RowsPerSheet feature.
         */
        public static class RowsPerSheet extends AbstractNumberPlanFeature {

            public RowsPerSheet(Long value) {
                super(value);
            }
        }

        /**
         * RowNums feature.
         */
        public static class RowNums extends AbstractNumberPlanFeature {

            public RowNums(Long value) {
                super(value);
            }
        }

        /**
         * MirrorNums feature.
         */
        public static class MirrorNums extends AbstractNumberPlanFeature {

            public MirrorNums(Long value) {
                super(value);
            }
        }

        /**
         * AdminNums feature.
         */
        public static class AdminNums extends AbstractNumberPlanFeature {

            public AdminNums(Long value) {
                super(value);
            }
        }

        /**
         * ApiCallNums feature.
         */
        public static class ApiCallNums extends AbstractNumberPlanFeature {

            public ApiCallNums(Long value) {
                super(value);
            }
        }

        /**
         * GalleryViews feature.
         */
        public static class GalleryViews extends AbstractNumberPlanFeature {

            public GalleryViews(Long value) {
                super(value);
            }
        }

        /**
         * KanbanViews feature.
         */
        public static class KanbanViews extends AbstractNumberPlanFeature {

            public KanbanViews(Long value) {
                super(value);
            }
        }

        /**
         * FormViews feature.
         */
        public static class FormViews extends AbstractNumberPlanFeature {

            public FormViews(Long value) {
                super(value);
            }
        }

        /**
         * GanttViews feature.
         */
        public static class GanttViews extends AbstractNumberPlanFeature {

            public GanttViews(Long value) {
                super(value);
            }
        }

        /**
         * CalendarViews feature.
         */
        public static class CalendarViews extends AbstractNumberPlanFeature {

            public CalendarViews(Long value) {
                super(value);
            }
        }

        /**
         * FieldPermissionNums feature.
         */
        public static class FieldPermissionNums extends AbstractNumberPlanFeature {

            public FieldPermissionNums(Long value) {
                super(value);
            }
        }

        /**
         * NodePermissionNums feature.
         */
        public static class NodePermissionNums extends AbstractNumberPlanFeature {

            public NodePermissionNums(Long value) {
                super(value);
            }
        }

        /**
         * Credit Nums feature.
         */
        public static class MessageCreditNums extends AbstractNumberPlanFeature {

            public MessageCreditNums(Long value) {
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
        public static class SocialConnect extends AbstractBooleanPlanFeature {

            public SocialConnect(boolean value) {
                super(value);
            }
        }

        /**
         * RainbowLabel feature.
         */
        public static class RainbowLabel extends AbstractBooleanPlanFeature {

            public RainbowLabel(boolean value) {
                super(value);
            }
        }

        /**
         * Watermark feature.
         */
        public static class Watermark extends AbstractBooleanPlanFeature {

            public Watermark(boolean value) {
                super(value);
            }
        }

        /**
         * AllowInvitation feature.
         */
        public static class AllowInvitation extends AbstractBooleanPlanFeature {

            public AllowInvitation(boolean value) {
                super(value);
            }
        }

        /**
         * AllowApplyJoin feature.
         */
        public static class AllowApplyJoin extends AbstractBooleanPlanFeature {

            public AllowApplyJoin(boolean value) {
                super(value);
            }
        }

        /**
         * AllowShare feature.
         */
        public static class AllowShare extends AbstractBooleanPlanFeature {

            public AllowShare(boolean value) {
                super(value);
            }
        }

        /**
         * AllowExport feature.
         */
        public static class AllowExport extends AbstractBooleanPlanFeature {

            public AllowExport(boolean value) {
                super(value);
            }
        }

        /**
         * AllowDownload feature.
         */
        public static class AllowDownload extends AbstractBooleanPlanFeature {

            public AllowDownload(boolean value) {
                super(value);
            }
        }

        /**
         * AllowCopyData feature.
         */
        public static class AllowCopyData extends AbstractBooleanPlanFeature {

            public AllowCopyData(boolean value) {
                super(value);
            }
        }

        /**
         * ShowMobileNumber feature.
         */
        public static class ShowMobileNumber extends AbstractBooleanPlanFeature {

            public ShowMobileNumber(boolean value) {
                super(value);
            }
        }

        /**
         * ContactIsolation feature.
         */
        public static class ContactIsolation extends AbstractBooleanPlanFeature {

            public ContactIsolation(boolean value) {
                super(value);
            }
        }

        /**
         * ForbidCreateOnCatalog feature.
         */
        public static class ForbidCreateOnCatalog extends AbstractBooleanPlanFeature {

            public ForbidCreateOnCatalog(boolean value) {
                super(value);
            }
        }

        /**
         * AllowEmbed feature.
         */
        public static class AllowEmbed extends AbstractBooleanPlanFeature {

            public AllowEmbed(boolean value) {
                super(value);
            }
        }

        /**
         * Billing OrgApi feature.
         */
        public static class AllowOrgApi extends AbstractBooleanPlanFeature {
            public AllowOrgApi(boolean value) {
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
        public static class RemainTrashDays extends AbstractNumberPlanFeature {

            public RemainTrashDays(Long value) {
                super(value);
            }
        }

        /**
         * RemainTimeMachineDays feature.
         */
        public static class RemainTimeMachineDays extends AbstractNumberPlanFeature {

            public RemainTimeMachineDays(Long value) {
                super(value);
            }
        }

        /**
         * RemainRecordActivityDays feature.
         */
        public static class RemainRecordActivityDays extends AbstractNumberPlanFeature {

            public RemainRecordActivityDays(Long value) {
                super(value);
            }
        }

        /**
         * AuditQueryDays feature.
         */
        public static class AuditQueryDays extends AbstractNumberPlanFeature {

            public AuditQueryDays(Long value) {
                super(value);
            }
        }
    }
}
