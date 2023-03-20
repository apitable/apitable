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

package com.apitable.interfaces.auth.facade;

import com.apitable.interfaces.auth.model.AuthParam;
import com.apitable.interfaces.auth.model.UserAuth;
import com.apitable.interfaces.auth.model.UserLogout;

/**
 * Auth Service Facade.
 */
public interface AuthServiceFacade {

    /**
     * user login.
     *
     * @param param login param
     * @return {@link UserAuth}
     */
    UserAuth ssoLogin(AuthParam param);

    /**
     * user logs out.
     *
     * @param userAuth {@link UserAuth}
     * @return {@link UserLogout}
     */
    UserLogout logout(UserAuth userAuth);
}
