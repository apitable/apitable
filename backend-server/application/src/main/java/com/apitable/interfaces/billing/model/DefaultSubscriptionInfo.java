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
 * Default Subscription.
 *
 * @author ShawnDeng
 */
public class DefaultSubscriptionInfo implements SubscriptionInfo {

    private final String product;

    private final String basePlan;

    private final SubscriptionFeature feature;

    public DefaultSubscriptionInfo() {
        this("CE", "ce_unlimited", new DefaultSubscriptionFeature());
    }

    /**
     * construct.
     *
     * @param product  product name
     * @param basePlan base plan name
     * @param feature  subscription feature
     */
    public DefaultSubscriptionInfo(String product, String basePlan, SubscriptionFeature feature) {
        this.product = product;
        this.basePlan = basePlan;
        this.feature = feature;
    }

    @Override
    public String getProduct() {
        return product;
    }

    @Override
    public boolean isFree() {
        return true;
    }

    @Override
    public boolean onTrial() {
        return false;
    }

    @Override
    public String getBasePlan() {
        return basePlan;
    }

    @Override
    public SubscriptionFeature getFeature() {
        return feature;
    }
}
