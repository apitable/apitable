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
import com.apitable.interfaces.user.model.RewardWizardAction;
import com.apitable.interfaces.user.model.RewardedUser;

/**
 * user service facade.
 */
public interface UserServiceFacade {

    void onUserChangeNicknameAction(Long userId, String nickname);

    InvitationCode getUserInvitationCode(Long userId);

    boolean getInvitationReward(Long userId);

    void createInvitationCode(Long userId);

    void rewardUserInfoUpdateAction(RewardedUser rewardedUser);

    void rewardWizardAction(RewardWizardAction wizardAction);

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
     * @param userAuth {@link UserAuth}
     */
    boolean verifyEmail(UserAuth userAuth);
}
