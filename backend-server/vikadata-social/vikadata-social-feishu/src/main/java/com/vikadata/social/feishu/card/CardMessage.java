package com.vikadata.social.feishu.card;

/**
 * Card message
 */
public class CardMessage implements Message {

    private String rootId;

    private Object content;

    private Boolean updateMulti;

    public CardMessage() {
    }

    public CardMessage(Object content) {
        this.content = content;
    }

    public void setRootId(String rootId) {
        this.rootId = rootId;
    }

    public void setUpdateMulti(Boolean updateMulti) {
        this.updateMulti = updateMulti;
    }

    public Boolean getUpdateMulti() {
        return updateMulti;
    }

    @Override
    public String getMsgType() {
        return "interactive";
    }

    @Override
    public String getContentKey() {
        throw new UnsupportedOperationException("card message not contain content field");
    }

    @Override
    public Object getContent() {
        return content;
    }

    @Override
    public String getRootId() {
        return rootId;
    }
}
