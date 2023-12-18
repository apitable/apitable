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
 * number type of plan feature.
 */
public class NumberPlanFeature implements PlanFeature<Long> {

    private Long value;

    private final boolean unlimited;

    public NumberPlanFeature(Long value) {
        this(value, value != null && value == -1);
    }

    public NumberPlanFeature(Long value, boolean unlimited) {
        this.value = value;
        this.unlimited = unlimited;
    }

    public void plus(long other) {
        value = value + other;
    }

    /**
     * unlimited if value is -1.
     *
     * @return true or false
     */
    public boolean isUnlimited() {
        return unlimited || (value != null && value == -1);
    }

    @Override
    public Long getValue() {
        return value;
    }
}
