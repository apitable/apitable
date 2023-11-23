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

package com.apitable.user.service;

/**
 * developer service.
 */
public interface IDeveloperService {

    /**
     * check whether the user has been configured.
     *
     * @param userId user id
     * @return true | false
     */
    boolean checkHasCreate(Long userId);

    /**
     * get api key.
     *
     * @param userId user id
     * @return api key
     */
    String getApiKeyByUserId(Long userId);

    /**
     * validate api key.
     *
     * @param apiKey access token
     * @return true | false
     */
    boolean validateApiKey(String apiKey);

    /**
     * create api key.
     *
     * @param userId user id
     * @return API KEY
     */
    String createApiKey(Long userId);

    /**
     * refresh api key.
     *
     * @param userId user id
     * @return new api api
     */
    String refreshApiKey(Long userId);
}
