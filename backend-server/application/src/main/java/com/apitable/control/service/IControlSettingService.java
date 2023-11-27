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

import com.apitable.control.entity.ControlSettingEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * Control setting service.
 */
public interface IControlSettingService extends IService<ControlSettingEntity> {

    /**
     * Get control unit settings.
     *
     * @param controlId Control unit ID
     * @return ControlSettingEntity
     */
    ControlSettingEntity getByControlId(String controlId);

    /**
     * Batch Access Permission Control Unit Settings.
     *
     * @param controlIds List of control unit IDs
     * @return ControlSettingEntities
     */
    List<ControlSettingEntity> getBatchByControlIds(List<String> controlIds);

    /**
     * Create permission control unit settings.
     *
     * @param userId    User ID
     * @param controlId Control unit ID
     */
    void create(Long userId, String controlId);

    /**
     * Delete the specified control unit settings.
     *
     * @param controlIds Control unit ID set
     */
    void removeByControlIds(Long userId, List<String> controlIds);
}
