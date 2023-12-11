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

package com.apitable.interfaces.billing.facade;

import com.apitable.interfaces.billing.model.EntitlementRemark;
import com.apitable.interfaces.billing.model.SubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import java.util.List;
import java.util.Map;

/**
 * entitlement service facade.
 */
public interface EntitlementServiceFacade {

    /**
     * get subscription info by space.
     *
     * @param spaceId space id
     * @return SubscriptionInfo
     */
    SubscriptionInfo getSpaceSubscription(String spaceId);

    /**
     * batch get subscription info by space.
     *
     * @param spaceIds space id list
     * @return SubscriptionFeature map
     */
    Map<String, SubscriptionFeature> getSpaceSubscriptions(List<String> spaceIds);

    /**
     * reward gift capacity.
     *
     * @param spaceId space id
     * @param remark  remark
     */
    default void rewardGiftCapacity(String spaceId, EntitlementRemark remark) {
        // Nothing to do default
    }

    default void cancelSubscription(String spaceId) {
        // Nothing to do default
    }
}
