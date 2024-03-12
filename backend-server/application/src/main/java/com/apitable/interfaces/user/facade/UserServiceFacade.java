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
 * user service facade.
 */
public interface UserServiceFacade {

    /**
     * event on user change email.
     *
     * @param userId user id
     * @param email  email address
     * @param oldEmail old email address
     */
    void onUserChangeEmailAction(Long userId, String email, String oldEmail);

    /**
     * event on user change avatar.
     *
     * @param userId    user id
     * @param avatarUrl avatar url
     */
    void onUserChangeAvatarAction(Long userId, String avatarUrl);

    /**
     * event on user change nickname.
     *
     * @param userId   user id
     * @param nickname nickname
     * @param init     init
     */
    void onUserChangeNicknameAction(Long userId, String nickname, Boolean init);

    /**
     * event on user close account.
     *
     * @param userId user id
     */
    void onUserCloseAccount(Long userId);

    /**
     * get user invitation code.
     *
     * @param userId user id
     * @return {@link InvitationCode} invitation code
     */
    InvitationCode getUserInvitationCode(Long userId);

    /**
     * whether user has invitation reward.
     *
     * @param userId user id
     * @return boolean
     */
    boolean getInvitationReward(Long userId);

    /**
     * create invitation code.
     *
     * @param userId user id
     */
    void createInvitationCode(Long userId);

    /**
     * reward when user info update.
     *
     * @param rewardedUser {@link RewardedUser} rewarded user
     */
    void rewardUserInfoUpdateAction(RewardedUser rewardedUser);

    /**
     * user reset password.
     *
     * @param userAuth {@link UserAuth}
     * @return boolean
     */
    boolean resetPassword(UserAuth userAuth);

    /**
     * user verification on email.
     *
     * @param email email
     */
    boolean verifyEmail(String email);
}
