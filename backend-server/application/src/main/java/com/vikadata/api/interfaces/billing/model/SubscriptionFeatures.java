package com.vikadata.api.interfaces.billing.model;

public class SubscriptionFeatures {

    public static class ConsumeFeatures {

        public static class Seat extends AbstractNumberPlanFeature {

            public Seat(Long value) {
                super(value);
            }
        }

        public static class CapacitySize extends AbstractNumberPlanFeature {

            public CapacitySize(Long value) {
                super(value);
            }
        }

        public static class SheetNums extends AbstractNumberPlanFeature {

            public SheetNums(Long value) {
                super(value);
            }
        }

        public static class RowsPerSheet extends AbstractNumberPlanFeature {

            public RowsPerSheet(Long value) {
                super(value);
            }
        }

        public static class RowNums extends AbstractNumberPlanFeature {

            public RowNums(Long value) {
                super(value);
            }
        }

        public static class MirrorNums extends AbstractNumberPlanFeature {

            public MirrorNums(Long value) {
                super(value);
            }
        }

        public static class AdminNums extends AbstractNumberPlanFeature {

            public AdminNums(Long value) {
                super(value);
            }
        }

        public static class ApiCallNums extends AbstractNumberPlanFeature {

            public ApiCallNums(Long value) {
                super(value);
            }
        }

        public static class GalleryViews extends AbstractNumberPlanFeature {

            public GalleryViews(Long value) {
                super(value);
            }
        }

        public static class KanbanViews extends AbstractNumberPlanFeature {

            public KanbanViews(Long value) {
                super(value);
            }
        }


        public static class FormViews extends AbstractNumberPlanFeature {

            public FormViews(Long value) {
                super(value);
            }
        }


        public static class GanttViews extends AbstractNumberPlanFeature {

            public GanttViews(Long value) {
                super(value);
            }
        }


        public static class CalendarViews extends AbstractNumberPlanFeature {

            public CalendarViews(Long value) {
                super(value);
            }
        }

        public static class FieldPermissionNums extends AbstractNumberPlanFeature {

            public FieldPermissionNums(Long value) {
                super(value);
            }
        }

        public static class NodePermissionNums extends AbstractNumberPlanFeature {

            public NodePermissionNums(Long value) {
                super(value);
            }
        }
    }

    public static class SubscribeFeatures {

        public static class SocialConnect extends AbstractBooleanPlanFeature {

            public SocialConnect(boolean value) {
                super(value);
            }
        }

        public static class RainbowLabel extends AbstractBooleanPlanFeature {

            public RainbowLabel(boolean value) {
                super(value);
            }
        }

        public static class Watermark extends AbstractBooleanPlanFeature {

            public Watermark(boolean value) {
                super(value);
            }
        }

        public static class AllowInvitation extends AbstractBooleanPlanFeature {

            public AllowInvitation(boolean value) {
                super(value);
            }
        }

        public static class AllowApplyJoin extends AbstractBooleanPlanFeature {

            public AllowApplyJoin(boolean value) {
                super(value);
            }
        }

        public static class AllowShare extends AbstractBooleanPlanFeature {

            public AllowShare(boolean value) {
                super(value);
            }
        }

        public static class AllowExport extends AbstractBooleanPlanFeature {

            public AllowExport(boolean value) {
                super(value);
            }
        }

        public static class AllowDownload extends AbstractBooleanPlanFeature {

            public AllowDownload(boolean value) {
                super(value);
            }
        }

        public static class AllowCopyData extends AbstractBooleanPlanFeature {

            public AllowCopyData(boolean value) {
                super(value);
            }
        }

        public static class ShowMobileNumber extends AbstractBooleanPlanFeature {

            public ShowMobileNumber(boolean value) {
                super(value);
            }
        }

        public static class ContactIsolation extends AbstractBooleanPlanFeature {

            public ContactIsolation(boolean value) {
                super(value);
            }
        }

        public static class ForbidCreateOnCatalog extends AbstractBooleanPlanFeature {

            public ForbidCreateOnCatalog(boolean value) {
                super(value);
            }
        }
    }

    public static class SolidFeatures {

        public static class RemainTrashDays extends AbstractNumberPlanFeature {

            public RemainTrashDays(Long value) {
                super(value);
            }
        }

        public static class RemainTimeMachineDays extends AbstractNumberPlanFeature {

            public RemainTimeMachineDays(Long value) {
                super(value);
            }
        }

        public static class RemainRecordActivityDays extends AbstractNumberPlanFeature {

            public RemainRecordActivityDays(Long value) {
                super(value);
            }
        }

        public static class AuditQueryDays extends AbstractNumberPlanFeature {

            public AuditQueryDays(Long value) {
                super(value);
            }
        }
    }
}
