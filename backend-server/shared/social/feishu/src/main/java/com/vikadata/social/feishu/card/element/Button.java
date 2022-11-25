package com.vikadata.social.feishu.card.element;

import java.util.Map;

import cn.hutool.core.map.MapUtil;

import com.vikadata.social.feishu.card.objects.Confirm;
import com.vikadata.social.feishu.card.objects.Text;
import com.vikadata.social.feishu.card.objects.Url;

/**
 * button element
 */
public class Button extends ActionElement {

    private Text text;

    private String url;

    private Url multiUrl;

    private StyleType type = StyleType.DEFAULT;

    private Confirm confirm;

    public Button() {
    }

    public Button(Text text) {
        super("button");
        this.text = text;
    }

    public Button(String methodName, Text text) {
        super("button", methodName);
        this.text = text;
    }

    public Button setType(StyleType s) {
        this.type = s;
        return this;
    }

    public Button setConfirm(Confirm c) {
        this.confirm = c;
        return this;
    }

    public Button setValue(Map<String, String> v) {
        super.addActionValues(v);
        return this;
    }

    public Button setUrl(String url) {
        this.url = url;
        this.multiUrl = null;
        return this;
    }

    public Button setMultiUrl(Url url) {
        this.multiUrl = url;
        this.url = null;
        return this;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = MapUtil.of("tag", getTag());

        if (text != null) {
            map.put("text", text.toObj());
        }

        if (url != null) {
            map.put("url", url);
        }

        if (multiUrl != null) {
            map.put("multi_url", multiUrl.toObj());
        }

        if (type != null) {
            map.put("type", type.name().toLowerCase());
        }

        map.put("value", getValue());

        if (confirm != null) {
            map.put("confirm", confirm.toObj());
        }

        return map;
    }

    /**
     * button style
     */
    public enum StyleType {
        /**
         * default style
         */
        DEFAULT,

        /**
         * primary style
         */
        PRIMARY,

        /**
         * danger style
         */
        DANGER
    }
}
