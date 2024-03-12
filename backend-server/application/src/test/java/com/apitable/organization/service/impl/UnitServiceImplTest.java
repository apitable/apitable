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

package com.apitable.organization.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import com.apitable.AbstractIntegrationTest;
import com.apitable.core.exception.BusinessException;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.organization.enums.OrganizationException;
import org.junit.jupiter.api.Test;

/**
 * unit service test.
 */
public class UnitServiceImplTest extends AbstractIntegrationTest {
    @Test
    void testCheckUnitWithNull() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        assertDoesNotThrow(() -> iUnitService.checkUnit(userSpace.getMemberId(), null));
    }

    @Test
    void testCheckUnitWithNotExists() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        BusinessException exception = assertThrows(BusinessException.class,
            () -> iUnitService.checkUnit(userSpace.getMemberId(), "123"));
        assertThat(exception.getCode()).isEqualTo(
            OrganizationException.ILLEGAL_UNIT_ID.getCode());
    }

    @Test
    void testCheckUnitWithNotInTeam() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long teamId = iTeamService.createSubTeam(userSpace.getSpaceId(), "test_team",
            iTeamService.getRootTeamId(userSpace.getSpaceId()));
        Long teamUnitId = iUnitService.getUnitIdByRefId(teamId);
        BusinessException exception = assertThrows(BusinessException.class,
            () -> iUnitService.checkUnit(userSpace.getMemberId(), teamUnitId.toString()));
        assertThat(exception.getCode()).isEqualTo(
            OrganizationException.ILLEGAL_UNIT_ID.getCode());
    }

    @Test
    void testCheckUnitWithWrongMember() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long memberId = iMemberService.createMember(userSpace.getUserId(), userSpace.getSpaceId(),
            iTeamService.getRootTeamId(userSpace.getSpaceId()));
        Long memberUnitId = iUnitService.getUnitIdByRefId(memberId);
        BusinessException exception = assertThrows(BusinessException.class,
            () -> iUnitService.checkUnit(userSpace.getMemberId(), memberUnitId.toString()));
        assertThat(exception.getCode()).isEqualTo(
            OrganizationException.ILLEGAL_UNIT_ID.getCode());
    }

}
