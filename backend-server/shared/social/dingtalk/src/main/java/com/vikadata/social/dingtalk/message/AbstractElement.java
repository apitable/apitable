package com.vikadata.social.dingtalk.message;

/**
 * Message Content Basic Properties
 */
public abstract class AbstractElement implements Element {

    private String title;

    public AbstractElement() {
    }

    public AbstractElement(String title) {
        this.title = title;
    }

    @Override
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
