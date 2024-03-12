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

import com.apitable.shared.listener.enums.FieldPermissionChangeEvent;
import com.apitable.workspace.vo.FieldPermission;
import com.apitable.workspace.vo.FieldRoleSetting;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Field Permission Change Notice Request Parameters.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class FieldPermissionChangeNotifyRo {

    private FieldPermissionChangeEvent event;

    private String datasheetId;

    private String fieldId;

    private String operator;

    private Long changeTime;

    private FieldRoleSetting setting;

    private List<ChangeObject> changes;

    /**
     * change object class.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangeObject {

        private List<String> uuids;

        private String role;

        private FieldPermission permission;
    }

}
