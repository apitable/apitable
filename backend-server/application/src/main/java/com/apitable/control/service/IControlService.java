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

package com.apitable.control.service;

import com.apitable.control.entity.ControlEntity;
import com.apitable.control.infrastructure.ControlType;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;
import java.util.function.Consumer;

/**
 * Control service.
 */
public interface IControlService extends IService<ControlEntity> {

    /**
     * Get space id.
     *
     * @param controlId Control Unit ID
     * @return spaceId
     * @author Chambers
     */
    String getSpaceIdByControlId(String controlId);

    /**
     * Query control unit.
     *
     * @param controlId Control unit ID
     * @return ControlEntity
     */
    ControlEntity getByControlId(String controlId);

    /**
     * Check the status of authority control unit.
     *
     * @param controlId Control unit ID
     * @param consumer  Custom consumer
     */
    void checkControlStatus(String controlId, Consumer<Boolean> consumer);

    /**
     * Create permission control unit.
     *
     * @param userId      User ID
     * @param spaceId     Space ID
     * @param controlId   Control unit ID
     * @param controlType Control unit type
     */
    void create(Long userId, String spaceId, String controlId, ControlType controlType);

    /**
     * Delete information about the control unit.
     *
     * @param controlIds Control unit ID set
     * @param delSetting Deleting control unit settings
     */
    void removeControl(Long userId, List<String> controlIds, boolean delSetting);

    /**
     * Get the permission control unit ID.
     *
     * @param prefix Control unit ID prefix
     * @param type   Control unit type
     * @return Control unit ID
     */
    List<String> getControlIdByControlIdPrefixAndType(String prefix, Integer type);

    /**
     * Get the existing control unit ID.
     *
     * @param controlIds Control unit ID set
     * @return Control unit ID
     */
    List<String> getExistedControlId(List<String> controlIds);

    /**
     * Get the member ID of the authority control unit creator.
     *
     * @param controlId Control unit ID
     * @return memberId
     */
    Long getOwnerMemberId(String controlId);
}
