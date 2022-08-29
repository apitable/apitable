package com.vikadata.social.dingtalk.message;

/**
 * <p>
 * 消息内容基础属性
 * </p>
 * @author zoe zheng
 * @date 2021/4/21 2:43 下午
 */
public abstract class AbstractElement implements Element {

    private String title;

    public AbstractElement() {
    }

    public AbstractElement(String title) {
        this.title = title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getTitle() {
        return title;
    }
}
