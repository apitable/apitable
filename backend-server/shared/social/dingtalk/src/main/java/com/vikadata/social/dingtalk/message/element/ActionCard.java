package com.vikadata.social.dingtalk.message.element;

import com.vikadata.social.dingtalk.message.AbstractElement;

/**
 * Card Content Basic Properties
 */
public abstract class ActionCard extends AbstractElement {
    private String markdown;

    public ActionCard() {
        super();
    }

    public ActionCard(String title, String markdown) {
        super(title);
        this.markdown = markdown;
    }

    public String getMarkdown() {
        return markdown;
    }

    public void setMarkdown(String markdown) {
        this.markdown = markdown;
    }
}
