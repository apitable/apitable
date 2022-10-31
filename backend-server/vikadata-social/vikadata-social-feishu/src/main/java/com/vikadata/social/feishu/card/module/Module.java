package com.vikadata.social.feishu.card.module;

import com.vikadata.social.feishu.card.AbstractTagged;
import com.vikadata.social.feishu.card.CardComponent;

/**
 * card content module
 */
public abstract class Module extends AbstractTagged implements CardComponent {

    public Module() {
    }

    public Module(String tag) {
        super(tag);
    }
}
