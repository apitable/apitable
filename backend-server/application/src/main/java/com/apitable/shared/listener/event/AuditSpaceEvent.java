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

package com.apitable.shared.listener.event;

import cn.hutool.json.JSONObject;
import com.apitable.space.enums.AuditSpaceAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

/**
 * <p>
 * Space audit Event.
 * </p>
 *
 * @author Chambers
 */
public class AuditSpaceEvent extends ApplicationEvent {

    private final AuditSpaceArg arg;

    public AuditSpaceEvent(Object source, AuditSpaceArg arg) {
        super(source);
        this.arg = arg;
    }

    /**
     * space audit argument.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class AuditSpaceArg {

        private AuditSpaceAction action;

        private Long userId;

        private String spaceId;

        private String nodeId;

        private String requestUserAgent;

        private String requestIp;

        private JSONObject info;
    }

    public AuditSpaceArg getArg() {
        return arg;
    }
}
