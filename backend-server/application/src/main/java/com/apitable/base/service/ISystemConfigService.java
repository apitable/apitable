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

package com.apitable.base.service;

import com.apitable.base.enums.SystemConfigType;

public interface ISystemConfigService {

    /**
     * Get generic configuration
     *
     * @param lang Language
     * @return val
     */
    Object getWizardConfig(String lang);

    /**
     * get configuration
     *
     * @param type  configuration type
     * @param lang  configuration language (optional)
     * @return config
     */
    String findConfig(SystemConfigType type, String lang);

    /**
     * save or update config
     *
     * @param userId    user id
     * @param type      configuration type
     * @param lang      configuration language
     * @param configVal configuration value
     */
    void saveOrUpdate(Long userId, SystemConfigType type, String lang, String configVal);

}
