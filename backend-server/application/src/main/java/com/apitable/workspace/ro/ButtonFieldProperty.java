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

package com.apitable.workspace.ro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Button Field Properties.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ButtonFieldProperty {

    /**
     * Associated number table ID.
     */
    private String text;

    /**
     * style.
     */
    private ButtonFieldStyle style;

    /**
     * action.
     */
    private ButtonFieldAction action;

    /**
     * Button style.
     */
    @Data
    @Builder(toBuilder = true)
    public static class ButtonFieldStyle {
        /**
         * 0: Background.
         * 1: OnlyText.
         */
        private Integer type;
        /**
         * color.
         */
        private Integer color;
    }

    /**
     * Button style.
     */
    @Data
    @Builder(toBuilder = true)
    public static class ButtonFieldAction {
        /**
         * 0: OpenLink.
         * 1: TriggerAutomation.
         */
        private Integer type;

        /**
         * link.
         */
        private ButtonFieldActionLink openLink;

        /**
         * automation.
         */
        private ButtonFieldActionAutomation automation;
    }

    /**
     * Button action link.
     */
    @Data
    @Builder(toBuilder = true)
    public static class ButtonFieldActionLink {
        /**
         * 0: Text.
         * 1: Expression.
         */
        private Integer type;

        /**
         * expression or url text.
         */
        private String expression;
    }

    /**
     * Button action link.
     */
    @Data
    @Builder(toBuilder = true)
    public static class ButtonFieldActionAutomation {
        /**
         * automation id.
         */
        private String automationId;

        /**
         * trigger id.
         */
        private String triggerId;
    }
}
