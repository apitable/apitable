package com.vikadata.social.feishu.card.element;

import com.vikadata.social.feishu.card.AbstractTagged;
import com.vikadata.social.feishu.card.CardComponent;

/**
 * <p>
 * 元素 基类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 14:14
 */
public abstract class Element extends AbstractTagged implements CardComponent {

    public Element() {
    }

    public Element(String tag) {
        super(tag);
    }
}
