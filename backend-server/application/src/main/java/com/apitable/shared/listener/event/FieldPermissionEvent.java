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

import com.apitable.shared.listener.enums.FieldPermissionChangeEvent;
import com.apitable.workspace.ro.FieldControlProp;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

/**
 * <p>
 * Field Permission Event.
 * </p>
 *
 * @author Chambers
 */
@Getter
public class FieldPermissionEvent extends ApplicationEvent {

    private static final long serialVersionUID = 4958921396891987695L;

    private final Arg arg;

    public FieldPermissionEvent(Object source, Arg arg) {
        super(source);
        this.arg = arg;
    }

    /**
     * argument.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class Arg {

        private FieldPermissionChangeEvent event;

        private String datasheetId;

        private String fieldId;

        private String uuid;

        private String operator;

        private Integer changeTime;

        private String role;

        private List<Long> changedUnitIds;

        private List<Long> delUnitIds;

        private FieldControlProp setting;

        private Boolean includeExtend;
    }

}
