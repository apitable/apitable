package com.vikadata.api.interfaces.user.facade;

import com.vikadata.api.interfaces.user.model.InvitationCode;
import com.vikadata.api.interfaces.user.model.RewardWizardAction;
import com.vikadata.api.interfaces.user.model.RewardedUser;

public class DefaultUserServiceFacadeImpl implements UserServiceFacade {

    @Override
    public void onUserChangeNicknameAction(Long userId, String nickname) {

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
    public void rewardWizardAction(RewardWizardAction wizardAction) {

    }

}
