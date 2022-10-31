package com.vikadata.social.feishu.card.module;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.vikadata.social.feishu.card.CardComponent;
import com.vikadata.social.feishu.card.Layout;
import com.vikadata.social.feishu.card.element.Element;

/**
 * Interactive module
 */
public class Action extends Module {

    private List<Element> actions;

    private Layout layout;

    public Action() {
    }

    public Action(List<Element> actions) {
        super("action");
        this.actions = actions;
    }

    public Action(List<Element> actions, Layout layout) {
        this(actions);
        this.layout = layout;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(16);

        map.put("tag", getTag());
        map.put("actions", actions.stream().map(CardComponent::toObj).collect(Collectors.toList()));

        if (layout != null) {
            map.put("layout", layout.value());
        }

        return map;
    }
}
