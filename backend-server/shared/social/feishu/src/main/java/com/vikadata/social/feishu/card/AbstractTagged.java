package com.vikadata.social.feishu.card;

/**
 * Card Content Basic Properties
 */
public class AbstractTagged implements Tagged {

    private String tag;

    public AbstractTagged() {
    }

    public AbstractTagged(String tag) {
        this.tag = tag;
    }

    @Override
    public String getTag() {
        return tag;
    }
}
