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

import static java.util.Collections.emptyList;

import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CapacitySize;
import java.time.LocalDate;
import java.util.List;

/**
 * Subscription Info.
 */
public interface SubscriptionInfo {

    /**
     * return billing version.
     *
     * @return billing version
     */
    default String getVersion() {
        return "V1";
    }

    /**
     * return product name.
     *
     * @return billing product name
     */
    String getProduct();

    /**
     * indicate whether it is free.
     *
     * @return true | false
     */
    boolean isFree();

    /**
     * indicate whether trial period.
     *
     * @return true | false
     */
    boolean onTrial();

    /**
     * return billing mode.
     *
     * @return billing mode
     */
    default String getBillingMode() {
        return null;
    }

    /**
     * billing recurring interval.
     *
     * @return recurring interval
     */
    default String getRecurringInterval() {
        return null;
    }

    /**
     * base plan name.
     *
     * @return base plan name
     */
    String getBasePlan();

    /**
     * add-on plan list.
     *
     * @return plan list
     */
    default List<String> getAddOnPlans() {
        return emptyList();
    }

    /**
     * start date.
     *
     * @return effective start date
     */
    default LocalDate getStartDate() {
        return null;
    }

    /**
     * end date.
     *
     * @return effective end date
     */
    default LocalDate getEndDate() {
        return null;
    }

    /**
     * return billing cycle day of month.
     *
     * @param defaultDayOfMonth default day of month if not free
     * @return billing cycle day of month
     */
    default int cycleDayOfMonth(int defaultDayOfMonth) {
        if (getRecurringInterval() == null || getRecurringInterval().isEmpty()) {
            return defaultDayOfMonth;
        }
        return getStartDate().getDayOfMonth();
    }

    /**
     * feature map.
     *
     * @return billing plan feature
     */
    SubscriptionFeature getFeature();

    /**
     * return gift capacity.
     *
     * @return gift capacity
     */
    default CapacitySize getGiftCapacity() {
        return new CapacitySize(0L);
    }

    /**
     * return total capacity.
     *
     * @return total capacity
     */
    default CapacitySize getTotalCapacity() {
        return new CapacitySize(getFeature().getCapacitySize().getValue().toBytes());
    }

    /**
     * return config.
     *
     * @return config
     */
    default SubscriptionConfig getConfig() {
        return SubscriptionConfig.create();
    }
}
