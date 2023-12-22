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

package com.apitable.shared.component;

import static com.apitable.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_DISABLE;

import com.apitable.control.infrastructure.ControlIdBuilder;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.listener.event.FieldPermissionEvent;
import com.apitable.shared.listener.event.FieldPermissionEvent.Arg;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Permission broadcast factory.
 * </p>
 *
 * @author Chambers
 */
@Component
public class SocketBroadcastFactory {

    public static SocketBroadcastFactory me() {
        return SpringContextHolder.getBean(SocketBroadcastFactory.class);
    }

    /**
     * field broadcast.
     *
     * @param memberName member name
     * @param controlIds control ids
     */
    public void fieldBroadcast(String memberName, List<String> controlIds) {
        controlIds.forEach(controlId -> {
            int index = controlId.indexOf(ControlIdBuilder.SYMBOL);
            Arg arg = Arg.builder().event(FIELD_PERMISSION_DISABLE)
                .datasheetId(controlId.substring(0, index))
                .fieldId(controlId.substring(index + 1))
                .operator(memberName).build();
            SpringContextHolder.getApplicationContext()
                .publishEvent(new FieldPermissionEvent(this, arg));
        });
    }
}
