package com.vikadata.social.feishu.card;

/**
 * <p>
 * 卡片内容基础属性
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 11:54
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
