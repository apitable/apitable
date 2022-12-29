package com.vikadata.api.interfaces.user.model;

public class RewardWizardAction {

    private Long userId;

    private String wizardId;

    public RewardWizardAction(Long userId, String wizardId) {
        this.userId = userId;
        this.wizardId = wizardId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getWizardId() {
        return wizardId;
    }
}
