package com.vikadata.social.dingtalk.message.element;

import com.vikadata.social.dingtalk.message.AbstractElement;

/**
 * <p>
 * 卡片内容基础属性
 * </p>
 * @author zoe zheng
 * @date 2021/4/21 2:51 下午
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

    public void setMarkdown(String markdown) {
        this.markdown = markdown;
    }

    public String getMarkdown() {
        return markdown;
    }
}
