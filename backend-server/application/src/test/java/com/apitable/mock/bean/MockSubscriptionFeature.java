package com.apitable.mock.bean;

import com.apitable.interfaces.billing.model.DefaultSubscriptionFeature;
import com.apitable.interfaces.billing.model.SubscriptionFeatures;

public class MockSubscriptionFeature extends DefaultSubscriptionFeature {

    private SubscriptionFeatures.ConsumeFeatures.Seat seat;

    private SubscriptionFeatures.ConsumeFeatures.AiAgentNums aiAgentNums;

    private SubscriptionFeatures.ConsumeFeatures.FileNodeNums fileNodeNums;

    @Override
    public SubscriptionFeatures.ConsumeFeatures.AiAgentNums getAiAgentNums() {
        return aiAgentNums;
    }

    @Override
    public SubscriptionFeatures.ConsumeFeatures.FileNodeNums getFileNodeNums() {
        return fileNodeNums;
    }

    public void setAiAgentNums(long value) {
        this.aiAgentNums = new SubscriptionFeatures.ConsumeFeatures.AiAgentNums(value);
    }

    public void setFileNodeNums(long value) {
        this.fileNodeNums = new SubscriptionFeatures.ConsumeFeatures.FileNodeNums(value);
    }

    @Override
    public SubscriptionFeatures.ConsumeFeatures.Seat getSeat() {
        return seat;
    }

    public void setSeat(long value) {
        this.seat = new SubscriptionFeatures.ConsumeFeatures.Seat(value);
    }
}
