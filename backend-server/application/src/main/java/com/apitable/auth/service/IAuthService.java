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

package com.apitable.auth.service;

import com.apitable.auth.dto.UserLoginDTO;
import com.apitable.auth.ro.LoginRo;

/**
 * Authorization related service interface.
 */
public interface IAuthService {

    /**
     * Register.
     *
     * @param username username
     * @param password password
     * @return user id
     */
    Long register(String username, String password);

    /**
     * Register.
     *
     * @param username username
     * @param password password
     * @param lang language code
     * @return user id
     */
    Long register(String username, String password, String lang);

    /**
     * Password login, only log in existing users, no need to automatically register an account.
     *
     * @param loginRo request parameters
     * @return user id
     */
    Long loginUsingPassword(LoginRo loginRo);

    /**
     * Login with mobile phone verification code, if it does not exist, the account will be
     * registered automatically.
     *
     * @param loginRo request parameters
     * @return user id
     */
    UserLoginDTO loginUsingSmsCode(LoginRo loginRo);

    /**
     * Email login, only log in existing users, no need to automatically register an account.
     *
     * @param loginRo request parameters
     * @return user id
     */
    UserLoginDTO loginUsingEmailCode(LoginRo loginRo);
}
