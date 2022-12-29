package com.vikadata.social.feishu.card.element;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.vikadata.social.feishu.card.objects.Confirm;
import com.vikadata.social.feishu.card.objects.Option;

/**
 * Collapsed button menu element
 */
public class Overflow extends ActionElement {

    private List<Option> options;

    private Confirm confirm;

    public Overflow() {
    }

    public Overflow(String methodName, List<Option> options) {
        super("overflow", methodName);
        this.options = options;
    }

    public Overflow setValue(Map<String, String> value) {
        super.addActionValues(value);
        return this;
    }

    public Overflow setConfirm(Confirm confirm) {
        this.confirm = confirm;
        return this;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(16);

        map.put("tag", getTag());
        map.put("options", options.stream().map(Option::toObj).collect(Collectors.toList()));

        map.put("value", getValue());

        if (confirm != null) {
            map.put("confirm", confirm.toObj());
        }

        return map;
    }
}
