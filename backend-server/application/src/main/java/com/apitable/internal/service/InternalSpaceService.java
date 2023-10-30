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

package com.apitable.internal.service;

import com.apitable.internal.ro.SpaceStatisticsRo;
import com.apitable.internal.vo.InternalCreditUsageVo;
import com.apitable.internal.vo.InternalSpaceApiRateLimitVo;
import com.apitable.internal.vo.InternalSpaceApiUsageVo;
import com.apitable.internal.vo.InternalSpaceAutomationRunMessageV0;
import com.apitable.internal.vo.InternalSpaceInfoVo;
import com.apitable.internal.vo.InternalSpaceSubscriptionVo;

/**
 * internal space service.
 */
public interface InternalSpaceService {

    /**
     * get space entitlement view.
     *
     * @param spaceId space id
     * @return InternalSpaceSubscriptionVo
     */
    InternalSpaceSubscriptionVo getSpaceEntitlementVo(String spaceId);

    /**
     * get space credit usage.
     *
     * @param spaceId space id
     * @return InternalCreditUsageVo
     */
    InternalCreditUsageVo getSpaceCreditUsageVo(String spaceId);

    /**
     * get space automation run nums.
     *
     * @param spaceId space id
     * @return InternalSpaceAutomationRunMessageV0
     */
    InternalSpaceAutomationRunMessageV0 getAutomationRunMessageV0(String spaceId);

    /**
     * get space api usage in entitlement.
     *
     * @param spaceId space id
     * @return InternalSpaceApiUsageVo
     */
    InternalSpaceApiUsageVo getSpaceEntitlementApiUsageVo(String spaceId);

    /**
     * get space api qps in entitlement.
     *
     * @param spaceId space id
     * @return InternalSpaceApiRateLimitVo
     */
    InternalSpaceApiRateLimitVo getSpaceEntitlementApiRateLimitVo(String spaceId);

    /**
     * get space info.
     *
     * @param spaceId space id
     * @return {@link InternalSpaceInfoVo}
     */
    InternalSpaceInfoVo getSpaceInfo(String spaceId);

    /**
     * update space statistics which stored in cache.
     *
     * @param spaceId space id
     * @param data    data
     */
    void updateSpaceStatisticsInCache(String spaceId, SpaceStatisticsRo data);
}
