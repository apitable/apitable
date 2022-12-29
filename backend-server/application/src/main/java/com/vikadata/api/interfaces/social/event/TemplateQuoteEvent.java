package com.vikadata.api.interfaces.social.event;

public class TemplateQuoteEvent implements SocialEvent {

    private String spaceId;

    private String nodeId;

    private String templateId;

    private Long memberId;

    public TemplateQuoteEvent(String spaceId, String nodeId, String templateId, Long memberId) {
        this.spaceId = spaceId;
        this.nodeId = nodeId;
        this.templateId = templateId;
        this.memberId = memberId;
    }

    @Override
    public CallEventType getEventType() {
        return CallEventType.TEMPLATE_QUOTE;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public String getNodeId() {
        return nodeId;
    }

    public String getTemplateId() {
        return templateId;
    }

    public Long getMemberId() {
        return memberId;
    }
}
