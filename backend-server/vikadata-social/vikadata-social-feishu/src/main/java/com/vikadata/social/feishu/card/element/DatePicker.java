package com.vikadata.social.feishu.card.element;

import java.util.Map;

import cn.hutool.core.map.MapUtil;

import com.vikadata.social.feishu.card.objects.Confirm;
import com.vikadata.social.feishu.card.objects.Text;

/**
 * date control element
 */
public class DatePicker extends ActionElement {

    private Text placeholder;

    private String initialDate;

    private Confirm confirm;

    public DatePicker() {
    }

    public DatePicker(String methodName) {
        super("date_picker", methodName);
    }

    public DatePicker setPlaceholder(Text placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    public DatePicker setInitialDate(String initialDate) {
        this.initialDate = initialDate;
        return this;
    }

    public DatePicker setValue(Map<String, String> value) {
        super.addActionValues(value);
        return this;
    }

    public DatePicker setConfirm(Confirm confirm) {
        this.confirm = confirm;
        return this;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = MapUtil.of("tag", getTag());

        if (placeholder != null) {
            map.put("placeholder", placeholder.toObj());
        }

        if (initialDate != null) {
            map.put("initial_date", initialDate);
        }

        map.put("value", getValue());

        if (confirm != null) {
            map.put("confirm", confirm.toObj());
        }

        return map;
    }
}
