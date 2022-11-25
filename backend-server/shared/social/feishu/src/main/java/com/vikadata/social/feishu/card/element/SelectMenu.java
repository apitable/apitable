package com.vikadata.social.feishu.card.element;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.map.MapUtil;

import com.vikadata.social.feishu.card.objects.Confirm;
import com.vikadata.social.feishu.card.objects.Option;
import com.vikadata.social.feishu.card.objects.Text;

/**
 * options menu element
 */
public abstract class SelectMenu extends ActionElement {

    private Text placeholder;

    private String initialOption;

    private List<Option> options;

    private Confirm confirm;

    public SelectMenu() {
    }

    public SelectMenu(String tag, String methodName) {
        super(tag, methodName);
    }

    public SelectMenu setPlaceholder(Text p) {
        this.placeholder = p;
        return this;
    }

    public SelectMenu setInitialOption(String io) {
        this.initialOption = io;
        return this;
    }

    public SelectMenu setOptions(List<Option> options) {
        this.options = options;
        return this;
    }

    public SelectMenu setValue(Map<String, String> value) {
        super.addActionValues(value);
        return this;
    }

    public SelectMenu setConfirm(Confirm c) {
        this.confirm = c;
        return this;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = MapUtil.of("tag", getTag());

        if (placeholder != null) {
            map.put("placeholder", placeholder.toObj());
        }

        if (initialOption != null) {
            map.put("initial_option", initialOption);
        }

        if (options != null) {
            map.put("options", options.stream().map(Option::toObj).collect(Collectors.toList()));
        }

        map.put("value", getValue());

        if (confirm != null) {
            map.put("confirm", confirm.toObj());
        }

        return map;
    }

    public static class SelectStatic extends SelectMenu {

        public SelectStatic(String actionName) {
            super("select_static", actionName);
        }
    }

    public static class SelectPerson extends SelectMenu {
        public SelectPerson(String actionName) {
            super("select_person", actionName);
        }
    }
}
