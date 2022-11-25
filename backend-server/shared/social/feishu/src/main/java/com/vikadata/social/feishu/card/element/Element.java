package com.vikadata.social.feishu.card.element;

import com.vikadata.social.feishu.card.AbstractTagged;
import com.vikadata.social.feishu.card.CardComponent;

/**
 * element base class
 */
public abstract class Element extends AbstractTagged implements CardComponent {

    public Element() {
    }

    public Element(String tag) {
        super(tag);
    }
}
