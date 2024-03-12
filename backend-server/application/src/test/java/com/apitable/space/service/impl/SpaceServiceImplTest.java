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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.apitable.AbstractIntegrationTest;
import com.apitable.core.exception.BusinessException;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.space.dto.GetSpaceListFilterCondition;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.space.enums.SpaceResourceGroupCode;
import com.apitable.space.vo.SeatUsage;
import com.apitable.space.vo.SpaceSubscribeVo;
import com.apitable.space.vo.SpaceVO;
import com.apitable.user.entity.UserEntity;
import com.apitable.workspace.enums.NodeType;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;

public class SpaceServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testGetBySpaceId() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceEntity spaceEntity = iSpaceService.getBySpaceId(mockUserSpace.getSpaceId());
        assertThat(spaceEntity).isNotNull();
    }

    @Test
    void testGetBySpaceIdNotExist() {
        assertThatThrownBy(() -> iSpaceService.getBySpaceId("xxxxx"))
            .isInstanceOf(BusinessException.class);
    }

    @Test
    void testCheckMemberIsAdminWithMainAdminNotException() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());
        // check no exceptions
        assertThatNoException().isThrownBy(
            () -> iSpaceService.checkMemberIsAdmin(mockUserSpace.getSpaceId(),
                mockUserSpace.getMemberId()));
    }

    @Test
    void testCheckMemberIsAdminNotException() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());
        UserEntity user = createUserWithEmail("shawndgh@163.com");
        Long newMemberId = createMember(user.getId(), mockUserSpace.getSpaceId());
        iSpaceRoleService.createRole(mockUserSpace.getSpaceId(),
            Collections.singletonList(newMemberId),
            Collections.singletonList(SpaceResourceGroupCode.MANAGE_MEMBER.getCode()));
        // check no exceptions
        assertThatNoException().isThrownBy(
            () -> iSpaceService.checkMemberIsAdmin(mockUserSpace.getSpaceId(), newMemberId));
    }

    @Test
    void testCheckMemberIsAdminThrowException() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());
        UserEntity user = createUserWithEmail("shawndgh@163.com");
        Long newMemberId = createMember(user.getId(), mockUserSpace.getSpaceId());
        assertThatThrownBy(
            () -> iSpaceService.checkMemberIsAdmin(mockUserSpace.getSpaceId(), newMemberId))
            .isInstanceOf(BusinessException.class);
    }

    @Test
    void getSpaceListWithAll() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        GetSpaceListFilterCondition condition = new GetSpaceListFilterCondition();
        condition.setManageable(false);
        List<SpaceVO> spaceVOList =
            iSpaceService.getSpaceListByUserId(userSpace.getUserId(), condition);
        assertThat(spaceVOList).isNotEmpty().hasSize(1);
    }

    @Test
    void getSpaceListWithAdmin() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        GetSpaceListFilterCondition condition = new GetSpaceListFilterCondition();
        condition.setManageable(true);
        List<SpaceVO> spaceVOList =
            iSpaceService.getSpaceListByUserId(userSpace.getUserId(), condition);
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
    void testGetNodeCountExcludeFolder() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        initNodeTreeMockData(userSpace.getSpaceId(), rootNodeId);
        long count =
            iSpaceService.getNodeCountBySpaceId(userSpace.getSpaceId(), NodeType::isFolder);
        assertThat(count).isNotZero().isEqualTo(5L);
    }

    @Test
    void testGetNodeCountExcludeFolderWhenNone() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        long count =
            iSpaceService.getNodeCountBySpaceId(userSpace.getSpaceId(), NodeType::isFolder);
        assertThat(count).isZero();
    }

    @Test
    void testCheckFileNumOverLimitWithThrownException() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        initNodeTreeMockData(userSpace.getSpaceId(), rootNodeId);
        assertThatThrownBy(() -> iSpaceService.checkFileNumOverLimit(userSpace.getSpaceId()))
            .isInstanceOf(BusinessException.class);
    }

    @Test
    void testCheckFileNumOverLimitWithoutException() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertThatNoException().isThrownBy(
            () -> iSpaceService.checkFileNumOverLimit(userSpace.getSpaceId()));
    }

    @Test
    void testGetSpaceSubscriptionInfo() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        SpaceSubscribeVo spaceSubscribeVo =
            iSpaceService.getSpaceSubscriptionInfo(userSpace.getSpaceId());
        assertThat(spaceSubscribeVo).isNotNull();
        assertThat(spaceSubscribeVo.getProduct()).isEqualTo("CE");
        assertThat(spaceSubscribeVo.getPlan()).isEqualTo("ce_unlimited");
        assertThat(spaceSubscribeVo.getOnTrial()).isFalse();
        assertThat(spaceSubscribeVo.getExpireAt()).isNull();
        assertThat(spaceSubscribeVo.getDeadline()).isNull();
        assertThat(spaceSubscribeVo.getMaxSeats()).isEqualTo(2L);
        assertThat(spaceSubscribeVo.getMaxCapacitySizeInBytes()).isEqualTo(1024 * 1024 * 1024L);
        assertThat(spaceSubscribeVo.getMaxSheetNums()).isEqualTo(5L);
        assertThat(spaceSubscribeVo.getMaxRowsPerSheet()).isEqualTo(100L);
        assertThat(spaceSubscribeVo.getMaxRowsInSpace()).isEqualTo(250L);
        assertThat(spaceSubscribeVo.getMaxAdminNums()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxMirrorNums()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxApiCall()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxGalleryViewsInSpace()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxKanbanViewsInSpace()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxFormViewsInSpace()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxGanttViewsInSpace()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxCalendarViewsInSpace()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getFieldPermissionNums()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getNodePermissionNums()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxMessageCredits()).isEqualTo(0L);
        assertThat(spaceSubscribeVo.getMaxRemainTimeMachineDays()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxRemainRecordActivityDays()).isEqualTo(-1L);
        assertThat(spaceSubscribeVo.getMaxAuditQueryDays()).isEqualTo(0);
        assertThat(spaceSubscribeVo.getAuditQuery()).isFalse();
        assertThat(spaceSubscribeVo.getRainbowLabel()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getWatermark()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getIntegrationFeishu()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getIntegrationDingtalk()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getIntegrationWeCom()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getIntegrationOfficePreview()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingAddressListIsolation()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingApplyJoinSpace()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingExport()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingCatalogManagement()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingDownloadFile()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingMobile()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingCopyCellData()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingInviteMember()).isEqualTo(false);
        assertThat(spaceSubscribeVo.getSecuritySettingShare()).isEqualTo(false);
    }

    @Test
    void testGetSeatUsage() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        // create ai node
        SeatUsage seatUsage = iSpaceService.getSeatUsage(userSpace.getSpaceId());
        assertThat(seatUsage).isNotNull();
        assertThat(seatUsage.getMemberCount()).isEqualTo(1L);
        assertThat(seatUsage.getTotal()).isEqualTo(1L);
    }


}
