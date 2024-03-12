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

package com.apitable.interfaces.user.facade;

import com.apitable.interfaces.auth.model.UserAuth;
import com.apitable.interfaces.user.model.InvitationCode;
import com.apitable.interfaces.user.model.RewardedUser;

/**
 * Abstract user service facade.
 */
public abstract class AbstractUserServiceFacadeImpl implements UserServiceFacade {

    @Override
    public void onUserChangeEmailAction(Long userId, String email, String oldEmail) {

    }

    @Override
    public void onUserChangeAvatarAction(Long userId, String avatarUrl) {

    }

    @Override
    public void onUserChangeNicknameAction(Long userId, String nickname, Boolean init) {

    }

    @Override
    public void onUserCloseAccount(Long userId) {

    }

    @Override
    public InvitationCode getUserInvitationCode(Long userId) {
        return new InvitationCode();
    }

    @Override
    public boolean getInvitationReward(Long userId) {
        return false;
    }

    @Override
    public void createInvitationCode(Long userId) {
    }

    @Override
    public void rewardUserInfoUpdateAction(RewardedUser rewardedUser) {

    }

    @Override
    public boolean resetPassword(UserAuth userAuth) {
        return false;
    }

    @Override
    public boolean verifyEmail(String email) {
        return false;
    }

}
