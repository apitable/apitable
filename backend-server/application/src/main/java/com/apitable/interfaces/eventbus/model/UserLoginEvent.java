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

package com.apitable.interfaces.eventbus.model;

import com.apitable.auth.enums.LoginType;
import com.apitable.shared.util.information.ClientOriginInfo;

/**
 * user login event.
 */
public class UserLoginEvent implements EventBusEvent {

    private final Long userId;

    private LoginType loginType;

    private String scene;

    private final boolean register;

    private final ClientOriginInfo clientOriginInfo;

    /**
     * constructs.
     *
     * @param userId           user id
     * @param loginType        login type
     * @param register         register
     * @param clientOriginInfo client origin info
     */
    public UserLoginEvent(Long userId, LoginType loginType, boolean register,
                          ClientOriginInfo clientOriginInfo) {
        this.userId = userId;
        this.loginType = loginType;
        this.register = register;
        this.clientOriginInfo = clientOriginInfo;
    }

    /**
     * constructs.
     *
     * @param userId           user id
     * @param scene            scene
     * @param register         whether is register
     * @param clientOriginInfo client origin info
     */
    public UserLoginEvent(Long userId, String scene, boolean register,
                          ClientOriginInfo clientOriginInfo) {
        this.userId = userId;
        this.scene = scene;
        this.register = register;
        this.clientOriginInfo = clientOriginInfo;
    }

    @Override
    public EventBusEventType getEventType() {
        return EventBusEventType.USER_LOGIN;
    }

    public Long getUserId() {
        return userId;
    }

    public LoginType getLoginType() {
        return loginType;
    }

    public String getScene() {
        return scene;
    }

    public boolean isRegister() {
        return register;
    }

    public ClientOriginInfo getClientOriginInfo() {
        return clientOriginInfo;
    }
}
