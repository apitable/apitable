package com.vikadata.social.feishu.card.module;

import com.vikadata.social.feishu.card.AbstractTagged;
import com.vikadata.social.feishu.card.CardComponent;

/**
 * <p>
 * 卡片内容模块
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 11:54
 */
public abstract class Module extends AbstractTagged implements CardComponent {

    public Module() {
    }

    public Module(String tag) {
        super(tag);
    }
}
