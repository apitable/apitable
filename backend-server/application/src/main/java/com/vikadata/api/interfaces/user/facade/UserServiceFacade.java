package com.vikadata.api.interfaces.user.facade;

import com.vikadata.api.interfaces.user.model.InvitationCode;
import com.vikadata.api.interfaces.user.model.RewardWizardAction;
import com.vikadata.api.interfaces.user.model.RewardedUser;

public interface UserServiceFacade {

    void onUserChangeNicknameAction(Long userId, String nickname);

    InvitationCode getUserInvitationCode(Long userId);

    boolean getInvitationReward(Long userId);

    void createInvitationCode(Long userId);

    void rewardUserInfoUpdateAction(RewardedUser rewardedUser);

    void rewardWizardAction(RewardWizardAction wizardAction);
}
