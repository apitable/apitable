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

package com.apitable.space.service.impl;

import com.apitable.AbstractIntegrationTest;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.*;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.AuditQueryDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainRecordActivityDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTimeMachineDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SolidFeatures.RemainTrashDays;
import com.apitable.interfaces.billing.model.SubscriptionFeatures.SubscribeFeatures.*;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.space.dto.GetSpaceListFilterCondition;
import com.apitable.space.dto.SpaceCapacityUsedInfo;
import com.apitable.space.vo.SpaceVO;
import com.apitable.user.entity.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

public class SpaceServiceImplTest extends AbstractIntegrationTest {

    @MockBean
    private EntitlementServiceFacade entitlementServiceFacade;

    @Test
    void getSpaceListWithAll() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        GetSpaceListFilterCondition condition = new GetSpaceListFilterCondition();
        condition.setManageable(false);
        List<SpaceVO> spaceVOList = iSpaceService.getSpaceListByUserId(userSpace.getUserId(), condition);
        assertThat(spaceVOList).isNotEmpty().hasSize(1);
    }

    @Test
    void getSpaceListWithAdmin() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        GetSpaceListFilterCondition condition = new GetSpaceListFilterCondition();
        condition.setManageable(true);
        List<SpaceVO> spaceVOList = iSpaceService.getSpaceListByUserId(userSpace.getUserId(), condition);
        assertThat(spaceVOList).isNotEmpty().hasSize(1);
    }

    @Test
    void givenExitMemberWhenCheckUserInSpaceWhenSuccess() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iSpaceService.checkUserInSpace(userSpace.getUserId(), userSpace.getSpaceId(),
                status -> assertThat(status).isNotNull().isTrue());
    }

    @Test
    void givenNoExitMemberWhenCheckUserInSpaceWhenSuccess() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        UserEntity user = iUserService.createUserByEmail("boy@apitable.com");
        iSpaceService.checkUserInSpace(user.getId(), userSpace.getSpaceId(),
                status -> assertThat(status).isNotNull().isFalse());
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

    public static class TestSimpleSubscriptionFeature implements SubscriptionFeature {

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
        public AllowEmbed getAllowEmbed() {
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
