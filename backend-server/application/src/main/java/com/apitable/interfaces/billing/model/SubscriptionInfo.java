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

import java.time.LocalDate;
import java.util.List;

import com.apitable.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CapacitySize;

import static java.util.Collections.emptyList;

public interface SubscriptionInfo {

    default String getVersion() {
        return "V1";
    };

    String getProduct();

    boolean isFree();

    boolean onTrial();

    String getBasePlan();

    default List<String> getAddOnPlans() {
        return emptyList();
    }

    default LocalDate getStartDate() {
        return null;
    }

    default LocalDate getEndDate() {
        return null;
    }

    SubscriptionFeature getFeature();

    default CapacitySize getGiftCapacity() {
        return new CapacitySize(0L);
    }

    default CapacitySize getTotalCapacity() {
        return new CapacitySize(getFeature().getCapacitySize().getValue() + getGiftCapacity().getValue());
    }
}
