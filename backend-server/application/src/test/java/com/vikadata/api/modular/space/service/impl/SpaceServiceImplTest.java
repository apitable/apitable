package com.vikadata.api.modular.space.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.interfaces.billing.facade.EntitlementServiceFacade;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
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
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.mock.bean.MockUserSpace;
import com.vikadata.api.space.model.SpaceCapacityUsedInfo;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

public class SpaceServiceImplTest extends AbstractIntegrationTest {

    @MockBean
    private EntitlementServiceFacade entitlementServiceFacade;

    @Test
    void givenExitMemberWhenCheckUserInSpaceWhenSuccess() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSpaceService.checkUserInSpace(userSpace.getUserId(), userSpace.getSpaceId(),
                status -> assertThat(status).isTrue());
    }

    @Test
    void givenNoExitMemberWhenCheckUserInSpaceWhenSuccess() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        UserEntity user = iUserService.createUserByCli("vikaboy@vikadata.com", "123456789", "12345678910");
        iSpaceService.checkUserInSpace(user.getId(), userSpace.getSpaceId(),
                status -> assertThat(status).isFalse());
    }

    @Test
    void testGetSpaceCapacityUsedInfoIsOverUsed() {
        String spaceId = "spc01";
        Long capacityUsedSize = 2147483648L;
        SubscriptionInfo subscriptionInfo = new TestSimpleSubscriptionInfo(1073741824L, 314572800L);
        // given
        given(entitlementServiceFacade.getSpaceSubscription(spaceId)).willReturn(subscriptionInfo);
        // when
        SpaceCapacityUsedInfo spaceCapacityUsedInfo = iSpaceService.getSpaceCapacityUsedInfo(spaceId, capacityUsedSize);
        // then
        assertThat(spaceCapacityUsedInfo.getCurrentBundleCapacityUsedSizes()).isEqualTo(1073741824L);
        assertThat(spaceCapacityUsedInfo.getGiftCapacityUsedSizes()).isEqualTo(314572800L);
    }

    @Test
    void testGetSpaceCapacityUsedInfoAndGiftCapacityIsNotUse() {
        String spaceId = "spc01";
        Long capacityUsedSize = 1073741824L;
        SubscriptionInfo subscriptionInfo = new TestSimpleSubscriptionInfo(1073741824L, 314572800L);
        // given
        given(entitlementServiceFacade.getSpaceSubscription(spaceId)).willReturn(subscriptionInfo);
        // when
        SpaceCapacityUsedInfo spaceCapacityUsedInfo = iSpaceService.getSpaceCapacityUsedInfo(spaceId, capacityUsedSize);
        // then
        assertThat(spaceCapacityUsedInfo.getCurrentBundleCapacityUsedSizes()).isEqualTo(1073741824L);
        assertThat(spaceCapacityUsedInfo.getGiftCapacityUsedSizes()).isEqualTo(0L);
    }

    @Test
    void testGetSpaceCapacityUsedInfoAndGiftCapacityIsUse() {
        String spaceId = "spc01";
        Long capacityUsedSize = 1073741830L;
        SubscriptionInfo subscriptionInfo = new TestSimpleSubscriptionInfo(1073741824L, 314572800L);
        // given
        given(entitlementServiceFacade.getSpaceSubscription(spaceId)).willReturn(subscriptionInfo);
        // when
        SpaceCapacityUsedInfo spaceCapacityUsedInfo = iSpaceService.getSpaceCapacityUsedInfo(spaceId, capacityUsedSize);
        // then
        assertThat(spaceCapacityUsedInfo.getCurrentBundleCapacityUsedSizes()).isEqualTo(1073741824L);
        assertThat(spaceCapacityUsedInfo.getGiftCapacityUsedSizes()).isEqualTo(6L);
    }

    public static class TestSimpleSubscriptionInfo implements SubscriptionInfo {

        private final SubscriptionFeature feature;

        private final CapacitySize giftCapacity;

        public TestSimpleSubscriptionInfo(long capacitySize, long giftCapacitySize) {
            feature = new TestSimpleSubscriptionFeature(new CapacitySize(capacitySize));
            this.giftCapacity = new CapacitySize(giftCapacitySize);
        }

        @Override
        public String getProduct() {
            return null;
        }

        @Override
        public boolean isFree() {
            return true;
        }

        @Override
        public boolean onTrial() {
            return true;
        }

        @Override
        public String getBasePlan() {
            return null;
        }

        @Override
        public List<String> getAddOnPlans() {
            return SubscriptionInfo.super.getAddOnPlans();
        }

        @Override
        public LocalDate getStartDate() {
            return SubscriptionInfo.super.getStartDate();
        }

        @Override
        public LocalDate getEndDate() {
            return SubscriptionInfo.super.getEndDate();
        }

        @Override
        public SubscriptionFeature getFeature() {
            return feature;
        }

        @Override
        public CapacitySize getGiftCapacity() {
            return giftCapacity;
        }
    }

    public static class TestSimpleSubscriptionFeature implements SubscriptionFeature{

        private final CapacitySize capacity;

        public TestSimpleSubscriptionFeature(CapacitySize capacity) {
            this.capacity = capacity;
        }

        @Override
        public Seat getSeat() {
            return null;
        }

        @Override
        public CapacitySize getCapacitySize() {
            return capacity;
        }

        @Override
        public SheetNums getSheetNums() {
            return null;
        }

        @Override
        public RowsPerSheet getRowsPerSheet() {
            return null;
        }

        @Override
        public RowNums getRowNums() {
            return null;
        }

        @Override
        public MirrorNums getMirrorNums() {
            return null;
        }

        @Override
        public AdminNums getAdminNums() {
            return null;
        }

        @Override
        public ApiCallNums getApiCallNums() {
            return null;
        }

        @Override
        public GalleryViews getGalleryViews() {
            return null;
        }

        @Override
        public KanbanViews getKanbanViews() {
            return null;
        }

        @Override
        public FormViews getFormViews() {
            return null;
        }

        @Override
        public GanttViews getGanttViews() {
            return null;
        }

        @Override
        public CalendarViews getCalendarViews() {
            return null;
        }

        @Override
        public FieldPermissionNums getFieldPermissionNums() {
            return null;
        }

        @Override
        public NodePermissionNums getNodePermissionNums() {
            return null;
        }

        @Override
        public SocialConnect getSocialConnect() {
            return null;
        }

        @Override
        public RainbowLabel getRainbowLabel() {
            return null;
        }

        @Override
        public Watermark getWatermark() {
            return null;
        }

        @Override
        public AllowInvitation getAllowInvitation() {
            return null;
        }

        @Override
        public AllowApplyJoin getAllowApplyJoin() {
            return null;
        }

        @Override
        public AllowShare getAllowShare() {
            return null;
        }

        @Override
        public AllowExport getAllowExport() {
            return null;
        }

        @Override
        public AllowDownload getAllowDownload() {
            return null;
        }

        @Override
        public AllowCopyData getAllowCopyData() {
            return null;
        }

        @Override
        public ShowMobileNumber getShowMobileNumber() {
            return null;
        }

        @Override
        public ContactIsolation getContactIsolation() {
            return null;
        }

        @Override
        public ForbidCreateOnCatalog getForbidCreateOnCatalog() {
            return null;
        }

        @Override
        public RemainTrashDays getRemainTrashDays() {
            return null;
        }

        @Override
        public RemainTimeMachineDays getRemainTimeMachineDays() {
            return null;
        }

        @Override
        public RemainRecordActivityDays getRemainRecordActivityDays() {
            return null;
        }

        @Override
        public AuditQueryDays getAuditQueryDays() {
            return null;
        }
    }
}
