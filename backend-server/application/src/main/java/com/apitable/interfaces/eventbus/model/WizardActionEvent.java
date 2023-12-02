package com.apitable.interfaces.eventbus.model;

/**
 * wizard action event.
 */
public class WizardActionEvent implements EventBusEvent {

    private final Long userId;

    private final String wizardId;

    public WizardActionEvent(Long userId, String wizardId) {
        this.userId = userId;
        this.wizardId = wizardId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getWizardId() {
        return wizardId;
    }

    @Override
    public EventBusEventType getEventType() {
        return EventBusEventType.USER_WIZARD_CHANGE;
    }
}
